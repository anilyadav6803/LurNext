const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },

  completedVedio: {
    type: mongoose.Schema.Types.ObjectId,
    red: "subSection",
  },
});

module.exports = mongoose.model("courseProgress", courseProgressSchema);
