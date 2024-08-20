const mongoose = require("mongoose");
const { resetPassword } = require("../controllers/ResetPassword");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["Admin", "student", "Instructor"],
    required: true,
  },
  AdditionalDetails: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "profile",
  },
  courses: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
  },
  image: {
    type: string,
    required: true,
  },

  token: {
    type: string,
  },

  resetPasswordExpires: {
    type: Date,
  },
  courseProgress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseProgress",
  },
});

module.exports = mongoose.model("User", userSchema);
