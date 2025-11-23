import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!password || (!email && !username)) {
    throw new ApiError(400, "Provide email or username and password");
  }

  // find by email or username
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  // generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // store refresh token
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // prepare response
  const userResponse = user.toObject();
  delete userResponse.password;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: userResponse, accessToken, refreshToken },
        "Logged in successfully"
      )
    );
});

export { loginUser };
