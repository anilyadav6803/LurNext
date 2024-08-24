const Tag = require("../models/tags");

exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "all field are required",
      });
    }

    //create entry in DB
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);
    return res.status(200).json({
      success: true,
      message: "tag created successfully ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get alltags
exports.ShowAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true });
    return res.status(200).json({
      success: true,
      message: "tag created successfully ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
