import { asyncHandler } from "../utils/asynchandler.js";

const registerUser = asyncHandler(async (req, res, next) => {
  // logic for registering user
  res
    .status(200)
    .json({ success: true, message: "User registered successfully" });
});


export { registerUser };