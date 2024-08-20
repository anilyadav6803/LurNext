const User = require("../models/User");
const Otp = require("../models/otp"); // Assuming you have a separate model for storing OTPs
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
require("dotenv").config();

// Send OTP
exports.sendOTP = async (req, res) => {
  try {
    // Fetch email from request body
    const { email } = req.body;

    // Check if user already exists
    const checkUserPresent = await User.findOne({ email });

    // If user already exists, then return
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Generate OTP
    let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

    // Check if OTP is unique
    let result = await Otp.findOne({ otp: otp });
    while (result) {
        otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        result = await Otp.findOne({ otp: otp });
    }

    // Save OTP in the database with the associated email
    const otpInstance = new Otp({ email, otp });
    await otpInstance.save();

    // Send the OTP to the user's email (you'd need to implement the email sending logic)

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp, // You might want to remove this in production to avoid exposing the OTP
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while sending the OTP',
    });
  }
};

// Sign Up
exports.signUP = async (req, res) => {
    try {
        // Data fetching from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;

        // Validate data
        if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber || !otp) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match',
            });
        }

        // Check if user is already present
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            return res.status(400).json({
                success: false,
                message: 'User already registered',
            });
        }

        // Find the most recent OTP
        const recentOTP = await Otp.findOne({ email }).sort({ createdAt: -1 }).limit(1);

        // Validate OTP
        if (!recentOTP) {
            return res.status(400).json({
                success: false,
                message: 'OTP not found',
            });
        } else if (otp !== recentOTP.otp) { // Assuming the OTP field in the model is called `otp`
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create profile entry in the database
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        // Create the user entry in the database
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            contactNumber,
            accountType,
            additionalDetails: profileDetails._id,
            profile: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // Respond with success
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during registration',
        });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        // Get data from req body 
        const { email, password } = req.body;

        // Validate data
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user exists
        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "User not registered. Please register."
            });
        }

        // Generate JWT after matching password
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType // Ensure you're using user.role
            };

            const token = JWT.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            user.token = token;
            user.password = undefined; // Remove password from user object

            // Set token in cookie
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
                httpOnly: true, // Prevents client-side access
            };

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'Logged in successfully'
            });
        } else {
            // Handle invalid password
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

// Change Password
exports.changepassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // Validate input
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Check if new passwords match
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: 'New passwords do not match',
            });
        }

        // Get the logged-in user (assumed to be set in req.user by authentication middleware)
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check if the old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Old password is incorrect',
            });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        user.password = hashedNewPassword;
        await user.save();

        // Send email notification for password change (implement your email sending logic)
        // await sendEmail(user.email, "Password Updated", "Your password has been updated successfully.");

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while changing the password',
        });
    }
};
