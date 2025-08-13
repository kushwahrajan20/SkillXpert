import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to register"
    });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password "
      });
    }

    generateToken(res, user, `Welcome back ${user.name}`);
    res.status(200).json({
      success: true,
      message: "Login successful",
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to login"
    });
  }
}

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to logout"
    });
  }
}

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password").populate("enrolledCourses");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found"
      });
    }
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load user"
    });
  }
}

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;
    if (!profilePhoto) {
      return res.status(400).json({
        success: false,
        message: "No profile photo uploaded"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    //extract public id of old image from the url if exists
    if (user.photoURL) {
      const publicId = user.photoURL.split('/').pop().split('.')[0];
      await deleteMediaFromCloudinary(publicId);
    }

    //upload new image to cloudinary
    const cloudResponse = await uploadMedia(profilePhoto.path);
    const photoURL = cloudResponse.secure_url;

    const updatedData = { name, photoURL };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password")

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated Successfully."
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
}
