import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import dotenv from 'dotenv';

dotenv.config();


export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

 
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      return res.status(400).json({
        message: "Invalid email format.",
        success: false,
      });
    }

    
    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        message: "Phone number must be exactly 10 digits.",
        success: false,
      });
    }

    
    const isStrongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(
        password
      );
    if (!isStrongPassword) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
        success: false,
      });
    }

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    
    let profilePhotoUrl = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: { profilePhoto: profilePhotoUrl },
    });

    
    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    
    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Account created successfully.",
        success: true,
        user: newUser,
      });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password, and role are required",
        success: false,
      });
    }

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

   
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        success: true,
        user,
      });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};


export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: "none", secure: true })
      .json({ message: "Logged out successfully.", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};




export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const file = req.file;
    let cloudResponse;

    if (file) {
      cloudResponse = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "raw", format: "pdf", original_filename: file.originalname.split('.')[0] },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(file.buffer);
      });
    }

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(',').map(skill => skill.trim());
    }

    const userId = req.id; 
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    if (!user.profile) user.profile = {};



    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skillsArray) user.profile.skills = skillsArray;

    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const updateProfilePhoto = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No image file provided.", success: false });
    }

    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found.", success: false });
    }

    let cloudResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image", format: "webp", original_filename: file.originalname.split('.')[0] },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Image Upload Error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(file.buffer);
    });

    if (!user.profile) user.profile = {};
    user.profile.profilePhoto = cloudResponse.secure_url;
    await user.save();

    return res.status(200).json({
      message: "Profile photo updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const toggleSaveJob = async (req, res) => {
  try {
    const userId = req.id;
    const { jobId } = req.params;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found.", success: false });
    }

    if (!user.profile) user.profile = {};
    if (!user.profile.savedJobs) user.profile.savedJobs = [];

    const isSaved = user.profile.savedJobs.includes(jobId);

    if (isSaved) {
      user.profile.savedJobs = user.profile.savedJobs.filter(id => id.toString() !== jobId);
    } else {
      user.profile.savedJobs.push(jobId);
    }

    await user.save();

    return res.status(200).json({
      message: isSaved ? "Job removed from saved." : "Job saved successfully.",
      savedJobs: user.profile.savedJobs,
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};