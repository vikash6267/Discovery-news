const express = require("express");
const router = express.Router();
const { auth, requireRole, ROLES } = require("../middleware/auth");
const c = require("../controllers/staff");

router.use(auth);

router.get("/me", requireRole(...ROLES.STAFF), c.me);
router.get("/stats", requireRole(...ROLES.STAFF), c.stats);

// news workflow
router.get("/news", requireRole(...ROLES.STAFF), c.listNews);
router.get("/news/:id", requireRole(...ROLES.STAFF), c.getNews);
router.put("/news/:id/approve", requireRole(...ROLES.EDITORIAL), c.approve);
router.put("/news/:id/reject", requireRole(...ROLES.EDITORIAL), c.reject);
router.put("/news/:id/unpublish", requireRole(...ROLES.EDITORIAL), c.unpublish);

// staff accounts (master admin / sub admin)
router.get("/users", requireRole(...ROLES.MANAGE), c.listUsers);
router.post("/users", requireRole(...ROLES.MANAGE), c.createUser);
router.put("/users/:id", requireRole(...ROLES.MANAGE), c.updateUser);
router.delete("/users/:id", requireRole(...ROLES.MANAGE), c.deleteUser);

module.exports = router;
