import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";

const addCommentToPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post id");
  }

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const comment = await Comment.create({
    content,
    post: postId,
    owner: req.user?._id,
  });

  if (!comment) {
    throw new ApiError(500, "Failed to add comment please try again");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

export { addCommentToPost };
