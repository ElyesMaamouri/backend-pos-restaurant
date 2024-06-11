const mongoose = require("mongoose");

const workRangeSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
});

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: Number, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "serveur", "cuisine"],
      default: "serveur",
      required: true,
    },
    workRangeHours: { type: [workRangeSchema], required: true },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
