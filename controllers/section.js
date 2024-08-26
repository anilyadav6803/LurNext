const Section = require("../models/section");
const Course = require("../models/course");

exports.createSection = async (req, res) => {
  try {
    //data fatch

    const { sectionName, CourseID } = req.body;

    //data validation
    if (!sectionName || !CourseID) {
      return res.status(500).json({
        success: false,
        message: "all field are required",
      });
    }

    //create section
    const newSection = await Section.create({ sectionName });
    //update course with sectuon objectid
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      CourseID,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );


    // return response 
    return res.status(200).json({
        success: true,
        message: "section  created successfully ",
        updatedCourseDetails,
      });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message,
      });
  }
};
