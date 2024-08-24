const Course = require("../models/course");
const Tag = require("../models/tags");
const User = require("../models/User");
const uploadImageCloudinary = require("../utils/imageUploader");

//course create handler
exports.createCourse = async (req, res) => {
  try {
    //ferch data
    const { courseName, whatYouWillLearn, courseDescription, price, tag } =
      req.body;

    //get thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validate
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(500).json({
        success: false,
        message: "all field are required",
      });
    }

    //check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor Details  ", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "instuctor not found ",
      });
    }

    //check tag is valid or not
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "tag details not found ",
      });
    }

    //upload image cloudnariy

    const thumbnailImage = await uploadImageCloudinary(
      thumbnail,
      process.env.FLODER_NAME
    );

    //create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.success._id,
    });

    //add new course to the user schemaa of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails.id },
      {
        $push: {
          courses: newCourse.id,
        },
      },
      { new: true }
    );

    //update the tag ka schema
    await User.findByIdAndUpdate(
      {
        _id: tagDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
        success: true,
        message: "cousre creted successfully ",
        data : newCourse ,
      });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




//getall courses 
exports.showAllCourses = async (req , res) =>{
    try {

        const allcourses = await Course.find({} , {
            courseName:true ,
            thumbnail : true ,
            instructor : true ,
            ratingAndReview : true,
            studentEnrolled : true ,

        })
        .populate("instructor")
        .exec();


        return res.status(200).json({
            success: true,
            message: "cousre creted successfully ",
            data : newCourse ,
          });

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message : "Cannot fetch course data"
          });
    }
}