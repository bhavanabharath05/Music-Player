import User from "../models/userModel.js";
import imagekit from "../config/imagekit.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import sendMail from "../utils/sendMail.js";
import bcrypt from "bcryptjs";
dotenv.config();

/* ================= TOKEN ================= */
const createToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

/* ================= SIGNUP ================= */
const signup = async (req, res) => {
  console.log("✅ SIGNUP HIT", req.body);
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    let avatarUrl = "";
    if (avatar) {
      const uploadResponse = await imagekit.upload({
        file: avatar,
        fileName: `avatar_${Date.now()}.jpg`,
        folder: "/mern-music-player",
      });
      avatarUrl = uploadResponse.url;
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar: avatarUrl,
    });

    const token = createToken(user._id);

    // ✅ FIX: Return user object along with token
    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        favourites: user.favourites || []
      }
    });
  } catch (error) {
    console.log("🔥 SIGNUP ERROR 🔥");
    console.log(error);
    console.log(error.message);
    res.status(500).json({ message: error.message || "Signup failed" });
  }
};

/* ================= LOGIN ================= */
const login = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    console.log("FOUND USER:", user);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        favourites: user.favourites || []
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ME ================= */
const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  // ✅ FIX: Return user with favourites
  res.status(200).json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
    favourites: req.user.favourites || []
  });
};

/* ================= FORGOT PASSWORD ================= */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
try{
    await sendMail({
      to: user.email,
      subject: "Reset your password",
      html: `
        <p>Password Reset</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 10 minutes</p>
      `,
    });
  }catch(e){
    console.error("Mail error:", e.message);
  }

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= RESET PASSWORD ================= */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token is invalid or expired",
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE PROFILE ================= */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    console.log("✅ UPDATE PROFILE HIT");
    console.log("User ID:", userId);
    console.log("Request body:", req.body);

    if (!userId) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const { name, email, avatar, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update basic fields
    if (name) user.name = name;
    if (email) user.email = email;

    // Password update logic
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: "Both current and new password are required",
        });
      }

      const isMatch = await user.comparePassword(currentPassword);

      if (!isMatch) {
        return res.status(400).json({
          message: "Current password is incorrect",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters",
        });
      }

      user.password = newPassword;
    }

    // Avatar upload
    if (avatar) {
      try {
        const uploadResponse = await imagekit.upload({
          file: avatar,
          fileName: `avatar_${Date.now()}.jpg`,
          folder: "/mern-music-player",
        });

        user.avatar = uploadResponse.url;
      } catch (uploadError) {
        console.error("Avatar upload error:", uploadError);
        return res.status(500).json({
          message: "Failed to upload avatar",
        });
      }
    }

    await user.save();

    console.log("✅ Profile updated successfully");

    // ✅ FIX: Return updated user object
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        favourites: user.favourites || []
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export { signup, login, getMe, forgotPassword, resetPassword, updateProfile };