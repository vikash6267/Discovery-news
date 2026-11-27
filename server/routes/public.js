// Lean, cache-friendly read APIs used by the Next.js website (server side rendering).
const express = require("express");
const router = express.Router();
const News = require("../models/newsModel");
const Category = require("../models/category");
const SubCategory = require("../models/subCategory");
const { PUBLIC_NEWS } = require("../utills/newsFilter");

const CARD_FIELDS = "title subtitle slug type images category subcategory location createdAt publish view tag";

// GET /public/menu -> categories with their sub-categories (names only)
router.get("/menu", async (req, res) => {
  try {
    const categories = await Category.find({ active: { $ne: false } }).select("name subCategories").lean();
    const subs = await SubCategory.find({ active: { $ne: false } }).select("name category").lean();
    const byCat = {};
    subs.forEach((s) => (byCat[s.category] = byCat[s.category] || []).push({ _id: s._id, name: s.name }));
    res.json({
      success: true,
      categories: categories.map((c) => ({ _id: c._id, name: c.name, subCategories: byCat[c._id] || [] })),
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET /public/news?limit=&page=&category=&subcategory=&type=&q=
router.get("/news", async (req, res) => {
  try {
    const { limit = 100, page = 1, category, subcategory, type, q } = req.query;
    const filter = { $and: [PUBLIC_NEWS] };
    if (category) filter.$and.push({ category });
    if (subcategory) filter.$and.push({ subcategory });
    if (type) filter.$and.push({ type });
    if (q) filter.$and.push({ title: { $regex: String(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } });
    const lim = Math.min(parseInt(limit) || 100, 300);
    const [news, total] = await Promise.all([
      News.find(filter)
        .select(CARD_FIELDS)
        .populate("category", "name")
        .populate("subcategory", "name")
        .sort({ publish: -1, createdAt: -1 })
        .skip((Math.max(parseInt(page), 1) - 1) * lim)
        .limit(lim)
        .lean(),
      News.countDocuments(filter),
    ]);
    res.json({ success: true, news, total });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET /public/news/:slug  (increments view count)
router.get("/news/:slug", async (req, res) => {
  try {
    const news = await News.findOneAndUpdate(
      { slug: req.params.slug, ...PUBLIC_NEWS },
      { $inc: { view: 1 } },
      { new: true }
    )
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("author", "name")
      .lean();
    if (!news) return res.status(404).json({ success: false, message: "News not found" });
    res.json({ success: true, news });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET /public/slugs -> for sitemap
router.get("/slugs", async (req, res) => {
  const items = await News.find(PUBLIC_NEWS).select("slug title publish updatedAt createdAt images").sort({ publish: -1 }).limit(1000).lean();
  res.json({ success: true, news: items });
});

module.exports = router;
