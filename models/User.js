const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  userName: { type: String, unique: true, required: true },
  
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  accountStatus: {
    type: String,
    enum: ["active", "suspended", "banned"],
    required: true,
    default: "active",
  },
  accountType: {
    type: String,
    enum: ["manager", "reseller", "admin", "testManager", "testReseller"],
    required: true,
  },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model('User', userSchema);
