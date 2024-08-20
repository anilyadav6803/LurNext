const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const bcrypt = require("bcrypt")

exports.resetPasswordToken = async (req, res) => {
  try {
    // Get email from the body
    const { email } = req.body;

    // Check if the email is valid or not
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: "Your email is not registered with us.",
      });
    }

    // Generate token
    const token = crypto.randomUUID();

    // Update user by adding token and expiration time
    const updateDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000, // 5 minutes
      },
      { new: true }
    );

    // Construct the reset password URL
    const url = `http://localhost:3000/update-password/${token}`;

    // Send email with the reset password link
    await mailSender(
      email,
      "Password Reset Link",
      `Password reset link: ${url}`
    );

    // Return response
    return res.json({
      success: true,
      message: "Password reset link has been sent to your email.",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while processing your request. Please try again later.",
    });
  }
};

//resetPasswird
const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.resetPassword = async (req, res) => {
  try {
    // Data fetch from body
    const { password, confirPassword, token } = req.body;

    // Validate password match
    if (password !== confirPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // Get user details from the database using token
    const userDetails = await User.findOne({ token: token });

    // If no entry found, the token is invalid
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // Check if the token is expired
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token has expired.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password and remove the token
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword, token: null, resetPasswordExpires: null },
      { new: true }
    );

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request. Please try again later.",
    });
  }
};
