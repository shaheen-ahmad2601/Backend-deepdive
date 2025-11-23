import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    coverimage: { type: String, default: "" },
    refreshToken: { type: String, default: "" },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  const payload = { id: this._id };
  const secret = process.env.JWT_ACCESS_SECRET || "access-secret";
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
  return jwt.sign(payload, secret, { expiresIn });
};

userSchema.methods.generateRefreshToken = function () {
  const payload = { id: this._id };
  const secret = process.env.JWT_REFRESH_SECRET || "refresh-secret";
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
  return jwt.sign(payload, secret, { expiresIn });
};

const User = mongoose.model("User", userSchema);

export { User };
