import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { username, email, fullname, password } = req.body;

    // Basic validation
    if (!username || !email || !fullname || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check existing user by email or username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email or username already exists",
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      fullname,
      password,
      avatar: req.body.avatar ?? "",       // ideally you upload first
      coverimage: req.body.coverimage ?? "",
    });

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Remove password from output
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
