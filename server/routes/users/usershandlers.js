import jwt, { decode } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import Company from "../../models/Company.js";
import Training from "../../models/Training.js";
import Course from "../../models/Course.js";
import Job from "../../models/Job.js";
import config from "config";
import { validationResult } from "express-validator";
import Joi from "joi";
import path from "path";
import { fileURLToPath } from "url";
import * as cloudinarys from "../../utils/cloudinary.js";
import fs from "fs";
import crypto from "crypto";
import mongoose from "mongoose";
import Profile from "../../models/Profile.js";

import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../../nodemailer/sendEmail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
}

// -----------------------
//  registration
// -----------------------
export async function register(req, res) {
  let {
    firstName,
    lastName,
    email,
    location,
    dateOfBirth,
    mobileNumber,
    password,
    role,
  } = req.body;

  email = email.trim().toLowerCase(); 

  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ errors: [{ param: "email", msg: "Email already exists" }] });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiresAt = Date.now() + 60 * 60 * 1000;

  
    const user = new User({
      firstName,
      lastName,
      email,
      location,
      dateOfBirth,
      mobileNumber,
      password: hashedpass,
      dateOfcreation: Date.now(),
      isVerified: false,
      verificationToken,
      verificationTokenExpiresAt,
      role,
    });

    await user.save();

 
    const profile = new Profile({
      user: user.id,
      company: "",
      location: location || "",
      status: "active",
      skills: [],
      bio: "",
      experience: [],
      education: [],
    });
    await profile.save();

    
    const verificationURL = `http://${process.env.FRONTEND_URL}/ConfirmEmail?token=${verificationToken}`;
    try {
      await sendVerificationEmail(email, verificationURL);
    } catch (mailErr) {
  
      await User.findByIdAndDelete(user._id);
      await Profile.deleteOne({ user: user._id });
      return res.status(500).json({
        errors: [{ msg: "Registration succeeded but sending email failed." }],
      });
    }


    return res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error during registration");
  }


}

export async function login(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let { email, password } = req.body;
  email = email.toLowerCase();
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    if (user.role === "none") {
      return res.status(403).json({ msg: "Your account is disabled." });
    }
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "5days" },
      (err, token) => {
        if (err) {
          throw err;
        } else {
          res.json({
            token,
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            profilepic: user.profilepic,
          });
        }
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

  // -----------------------
  //  Email verification
  // -----------------------
  export async function verifyEmail(req, res) {
    const { token } = req.query;
    try {
      const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpiresAt: { $gt: Date.now() },
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid or expired verification token." });
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;
      await user.save();

      return res.json({ message: "Email verified successfully." });
    } catch (err) {
      console.error("Email verification error:", err);
      return res.status(500).json({ message: "Server error." });
    }
  }

  // POST /api/users/forgot-password
  export async function forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.json({
          message:
            "If that email is registered, you’ll receive reset instructions.",
        });
      }

      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiresAt = resetTokenExpiresAt;

      await user.save();

      const resetURL = `${process.env.BASE_URL}/api/users/reset-password?token=${resetToken}`;
      await sendPasswordResetEmail(email, resetURL);
    } catch (error) {
      console.log("Error in forgotPassword ", error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // -----------------------
  //  RESET PASSWORD
  // -----------------------
  // POST /api/users/reset-password?token=...

  //   const { token } = req.query;
  //   const { password: newPassword } = req.body;

  //   console.log("🔐 Received token:", token);
  //   console.log("🕒 Now:", new Date().toISOString());

  //   const user = await User.findOne({
  //     resetPasswordToken: token.trim(),
  //     resetPasswordExpiresAt: { $gt: Date.now() }
  //   });

  //   console.log("👤 Found user:", user);

  //   if (!user) {
  //     return res.status(400).json({ message: "Invalid or expired reset token." });
  //   }

  //   const salt = await bcrypt.genSalt(10);
  //   user.password = await bcrypt.hash(newPassword, salt);
  //   user.resetPasswordToken = undefined;
  //   user.resetPasswordExpiresAt = undefined;
  //   await user.save();

  //   await sendResetSuccessEmail(user.email);
  //   return res.json({ message: "Password has been reset successfully." });
  // }

  // -----------------------
  //  login
  // -----------------------

  export async function myprofile(req, res) {
    try {
      const foundUser = await User.findById(req.user.id).select("-password");
      res.send(foundUser);
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }

  function validateubdateinfo(obj) {
    const schema = Joi.object({
      firstName: Joi.string().trim().min(3).max(20),
      lastName: Joi.string().trim().min(3).max(20),
      password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),
    });
    return schema.validate(obj);
  }

  export async function editInfo(req, res) {
    const { error } = validateubdateinfo(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updateuser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: req.body.password,
        },
      },
      { new: true }
    ).select("-password");
    res.status(200).json(updateuser);
  }

  export async function getcount(req, res) {
    try {
      const [usercount, companycount, jobcount, traincount, coursecount] =
        await Promise.all([
          User.countDocuments(),
          Company.countDocuments(),
          Job.countDocuments(),
          Training.countDocuments(),
          Course.countDocuments(),
        ]);

      return res.status(200).json({
        usercount,
        companycount,
        jobcount,
        traincount,
        coursecount,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ msg: "fetch failed" });
    }
  }

  export async function uploadphoto(req, res) {
    if (!req.file) {
      return res.status(404).json({ msg: "error upload photo" });
    }
    try {
      const filepath = path.join(__dirname, `../../images/${req.file.filename}`);

      const result = await cloudinarys.cloudinaryUpload(filepath);

      const user = await User.findById(req.user.id);

      if (user.profilepic.publicid !== null) {
        await cloudinarys.cloudinaryremove(user.profilepic.publicid);
      }

      user.profilepic = {
        url: result.secure_url,
        publicid: result.public_id,
      };

      await user.save();
      res.status(200).json({
        msg: "photo updated seccessfully",
        url: result.secure_url,
        publicid: result.public_id,
      });
      fs.unlinkSync(filepath);
    } catch (error) {
      console.error(error);
      res.status(545).json({ msg: "error upload image" });
    }
  }

  export async function getphoto(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        res.status(400).json({ msg: "user not found" });
      } else {
        res.status(200).json({ url: user.profilepic.url });
      }
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  }

  export async function changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(400).json({ msg: "User not found" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "The old password is not correct" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "5days" },
        (err, token) => {
          if (err) throw err;
          res.json({
            message: "Password updated successfully.",
            token,
          });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Server error" });
    }
  }

  // -----------------------
  //   get all users for admin dashboard (show all users)
  // -----------------------
  export async function getAllUsers(req, res) {
    try {
      const users = await User.find().select("-password");
      res.status(200).json(users);
    } catch (error) {
      console.error("getAllUsers error:", error.message);
      res.status(500).json({ msg: "Failed to fetch users", error: error.message });
    }
  }
  // -----------------------
  //  get users by id for admin dashboard (view user details)
  // -----------------------
  export async function getUserById(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("getUserById error:", error.message);
      res.status(500).json({ msg: "Failed to fetch user", error: error.message });
    }
  }
  // -----------------------
  //  Enables or disables user account for admin dashboard.
  // -----------------------
  export async function toggleUserStatus(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ msg: "User not found" });

      user.role = user.role === "none" ? "user" : "none";

      await user.save();

      res.status(200).json({
        msg: `User account has been ${user.role === "none" ? "disabled" : "enabled"}`,
        role: user.role
      });
    } catch (error) {
      console.error("toggleUserStatus error:", error.message);
      res.status(500).json({ msg: "Server error while toggling status", error: error.message });
    }
  }
