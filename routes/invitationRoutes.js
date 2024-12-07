const express = require("express");
const invitationController = require("../controllers/invitationController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/send", protect, invitationController.sendInvitation);

module.exports = router;
