const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  courseDescription: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseContent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "section",
    required: true,
  },
  WhatyouwillLearn: {
    type: String,
    required: true,
  },
  ratingAndReview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ratingandreviews",
  },
  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  tags: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
  },
  studentEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
  ],
});
module.exports = mongoose.model("courseSchema", courseSchema);