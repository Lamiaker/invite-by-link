const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  verificationCode: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "used", "expired"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invitation", invitationSchema);
