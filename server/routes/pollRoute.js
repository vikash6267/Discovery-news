const { auth, requireRole, ROLES } = require("../middleware/auth");
const express = require("express")
const { createPoll, getAllPolls, voteInPoll, deletePollCtrl } = require("../controllers/pollCtrl")
const router = express.Router()

router.post("/create", auth, requireRole(...ROLES.MANAGE), createPoll)
router.get("/get", getAllPolls)
router.put("/vote/:id", voteInPoll)
router.delete("/delete/:id", auth, requireRole(...ROLES.MANAGE), deletePollCtrl)


module.exports = router