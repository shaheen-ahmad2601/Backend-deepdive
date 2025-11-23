import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  // Validate fields
  if ([fullname, email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "Fields cannot be empty strings");
  }

  // Check if user exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  // Validate avatar
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload images
  const avatarUpload = await uploadToCloudinary(avatarLocalPath);
  const coverUpload = coverImageLocalPath
    ? await uploadToCloudinary(coverImageLocalPath)
    : null;

  // Cloudinary returns `secure_url` (preferred) or `url`.
  const avatarUrl = avatarUpload?.secure_url || avatarUpload?.url;
  if (!avatarUrl) {
    console.error("Avatar upload response:", avatarUpload);
    throw new ApiError(500, "Failed to upload avatar");
  }

  // Create user
  // Create user
  const user = await User.create({
    fullname,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatarUrl,
    coverimage: coverUpload?.url || "",
  });

  // Remove password
  const userResponse = user.toObject();
  delete userResponse.password;

  const createdUser = await user
    .findById(user._id)
    .select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };

/*
   - get user details from frontend
   - validation of user - not empty
   - check if user already exists with email or username
   - check for images check for avatar
   - upload images to cloudinary, avatar uploadted or not
   - create user object in db - create entry in db
   - remove password and refresh token field from reponse
   - check for user creation success or failure
   - return response to frontend


   one of the ways to check empty strings
     if(
    [fullname,email,username,password].some((field)=> field?.trim() === "")
  ){
    throw new ApiError(400, "Fields cannot be empty strings");
  }
  
  */
