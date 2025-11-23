import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router(); // i will call the registerUser methods when user registers
router.route("/register").post(
  upload.fields([
    // middleware to handle avatar and cover image upload
    { name: "avatar", maxCount: 1 },
    { name: "coverimage", maxCount: 1 },
  ]),
  registerUser
);

export default router;

// Login route
router.route("/login").post(loginUser);
