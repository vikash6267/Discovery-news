// News visible to the public: approved ones, plus legacy documents (no `status` field)
// that were never switched off.
const PUBLIC_NEWS = {
  $or: [{ status: "approved" }, { status: { $exists: false }, active: { $ne: false } }],
};

module.exports = { PUBLIC_NEWS };
