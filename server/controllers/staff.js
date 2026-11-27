// Staff (admin panel) APIs: editorial queue, approvals, user/role management.
const bcrypt = require("bcrypt");
const News = require("../models/newsModel");
const User = require("../models/authModel");
const Category = require("../models/category");
const SubCategory = require("../models/subCategory");
const { PUBLIC_NEWS } = require("../utills/newsFilter");

const EDITORIAL = ["SuperAdmin", "Admin", "Editor"];
const ROLE_ORDER = ["Reporter", "Writer", "Editor", "Admin", "SuperAdmin"];
const ASSIGNABLE = {
  SuperAdmin: ["Admin", "Editor", "Writer", "Reporter"],
  Admin: ["Editor", "Writer", "Reporter"],
};

// effective workflow status of a (possibly legacy) document
const statusOf = (n) => n.status || (n.active === false ? "draft" : "approved");

// GET /staff/me
exports.me = async (req, res) => {
  const u = req.account.toObject();
  delete u.password;
  res.json({ success: true, user: u });
};

// GET /staff/news?status=pending|approved|rejected|all&q=&page=&limit=
exports.listNews = async (req, res) => {
  try {
    const { status = "all", q = "", page = 1, limit = 20 } = req.query;
    const me = req.account;
    const filter = {};
    if (!EDITORIAL.includes(me.role)) filter.$or = [{ submittedBy: me._id }, { author: me._id }];
    if (status !== "all") {
      if (status === "approved") {
        filter.$and = [...(filter.$and || []), PUBLIC_NEWS];
      } else {
        filter.status = status;
      }
    }
    if (q) filter.title = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };

    const skip = (Math.max(parseInt(page), 1) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      News.find(filter)
        .select("title slug status type images category subcategory location createdAt publish view author submittedBy approvedBy rejectReason")
        .populate("category", "name")
        .populate("subcategory", "name")
        .populate("submittedBy", "name role district")
        .populate("author", "name role district")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      News.countDocuments(filter),
    ]);
    res.json({ success: true, news: items.map((n) => ({ ...n, status: statusOf(n) })), total });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// GET /staff/news/:id  (for the edit form)
exports.getNews = async (req, res) => {
  try {
    const n = await News.findById(req.params.id).lean();
    if (!n) return res.status(404).json({ success: false, message: "Not found" });
    const me = req.account;
    if (!EDITORIAL.includes(me.role) && String(n.submittedBy || n.author) !== String(me._id)) {
      return res.status(403).json({ success: false, message: "Not your story" });
    }
    res.json({ success: true, news: { ...n, status: statusOf(n) } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// PUT /staff/news/:id/approve  (editorial roles)
exports.approve = async (req, res) => {
  try {
    const n = await News.findByIdAndUpdate(
      req.params.id,
      { status: "approved", active: true, approvedBy: req.account._id, approvedAt: new Date(), publish: new Date(), rejectReason: undefined },
      { new: true }
    );
    if (!n) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, news: n });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// PUT /staff/news/:id/reject  { reason }
exports.reject = async (req, res) => {
  try {
    const n = await News.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", rejectReason: req.body.reason || "", approvedBy: undefined },
      { new: true }
    );
    if (!n) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, news: n });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// PUT /staff/news/:id/unpublish  -> back to pending
exports.unpublish = async (req, res) => {
  try {
    const n = await News.findByIdAndUpdate(req.params.id, { status: "pending" }, { new: true });
    if (!n) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, news: n });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// GET /staff/stats
exports.stats = async (req, res) => {
  try {
    const me = req.account;
    const base = EDITORIAL.includes(me.role) ? {} : { $or: [{ submittedBy: me._id }, { author: me._id }] };
    const [approved, pending, rejected, categories, subCategories, users] = await Promise.all([
      News.countDocuments({ $and: [base, PUBLIC_NEWS] }),
      News.countDocuments({ ...base, status: "pending" }),
      News.countDocuments({ ...base, status: "rejected" }),
      Category.countDocuments(),
      SubCategory.countDocuments(),
      EDITORIAL.includes(me.role) ? User.countDocuments({ role: { $ne: "user" } }) : 0,
    ]);
    res.json({ success: true, stats: { approved, pending, rejected, categories, subCategories, staff: users } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ---- users / roles -----------------------------------------------------
// GET /staff/users
exports.listUsers = async (req, res) => {
  const users = await User.find({ role: { $ne: "user" } }).select("-password -token").sort({ createdAt: -1 }).lean();
  res.json({ success: true, users, assignable: ASSIGNABLE[req.account.role] || [] });
};

// POST /staff/users { name,email,password,role,district }
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, district = "" } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "name, email, password and role are required" });
    }
    if (!(ASSIGNABLE[req.account.role] || []).includes(role)) {
      return res.status(403).json({ success: false, message: `You cannot create a ${role}` });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    const u = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      district,
      location: district || "Madhya Pradesh",
      permissions: { canAdd: true, canEdit: true, canDelete: EDITORIAL.includes(role) },
    });
    res.status(201).json({ success: true, user: { _id: u._id, name, email, role, district } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// PUT /staff/users/:id { role?, active?, password?, district?, name? }
exports.updateUser = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ success: false, message: "Not found" });
    const myRank = ROLE_ORDER.indexOf(req.account.role);
    if (ROLE_ORDER.indexOf(target.role) >= myRank && String(target._id) !== String(req.account._id)) {
      return res.status(403).json({ success: false, message: "You cannot modify this account" });
    }
    const { role, active, password, district, name } = req.body;
    if (role) {
      if (!(ASSIGNABLE[req.account.role] || []).includes(role)) {
        return res.status(403).json({ success: false, message: `You cannot assign ${role}` });
      }
      target.role = role;
    }
    if (typeof active === "boolean" && String(target._id) !== String(req.account._id)) target.active = active;
    if (password) target.password = await bcrypt.hash(password, 10);
    if (district !== undefined) {
      target.district = district;
      target.location = district || target.location;
    }
    if (name) target.name = name;
    await target.save();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// DELETE /staff/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ success: false, message: "Not found" });
    if (String(target._id) === String(req.account._id)) {
      return res.status(400).json({ success: false, message: "You cannot delete yourself" });
    }
    if (ROLE_ORDER.indexOf(target.role) >= ROLE_ORDER.indexOf(req.account.role)) {
      return res.status(403).json({ success: false, message: "You cannot delete this account" });
    }
    await target.deleteOne();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
