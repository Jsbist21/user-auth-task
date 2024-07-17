import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

const sendResetEmail = (email, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset",
    text: `Please use the following link to reset your password: ${link}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fiels are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(400, "User already existed");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username or password is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect Password");
  }

  const loggedInUser = await User.findById(user._id).select("-password");

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            _id: loggedInUser._id,
            username: loggedInUser.username,
            accessToken,
          },
        },
        "User logged in successfully"
      )
    );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const secret = process.env.JWT_SECRET + user.password;

  const token = jwt.sign({ email: user.email, id: user._id }, secret, {
    expiresIn: "5m",
  });

  const link = `http://localhost:8000/api/v1/users/reset-password/${user._id}/${token}`;
  sendResetEmail(email, link);
  console.log(link);

  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset link send to your email"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({ _id: id });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const secret = process.env.JWT_SECRET + user.password;

  const verify = jwt.verify(token, secret);

  if (!verify) {
    throw new ApiError(400, "Invalid or expired token");
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json(new ApiResponse(200, "New password created"));
});

export { registerUser, loginUser, forgotPassword, resetPassword };
