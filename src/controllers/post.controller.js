import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { isValidObjectId } from "mongoose";

const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (content.trim() === "") {
    throw new ApiError(400, "Content field is required");
  }

  let postImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.postImage) &&
    req.files.postImage.length > 0
  ) {
    postImageLocalPath = req.files.postImage[0].path;
  }

  const postImage = await uploadOnCloudinary(postImageLocalPath);

  const post = await Post.create({
    content,
    postImage: postImage.url,
    owner: req.user?._id,
  });

  const postUpload = await Post.findById(post._id);

  if (!postUpload) {
    throw new ApiError(500, "Post creation is failed please try again.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post created successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  if (!content) {
    throw new ApiError(400, "content is required");
  }

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid postId");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post?.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "only owner can edit their post");
  }

  const newPost = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  if (!newPost) {
    throw new ApiError(500, "Failed to update post please try again");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newPost, "Post update successfully"));
});
