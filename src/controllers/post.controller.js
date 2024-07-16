import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";

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

const getAllPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const posts = await Post.aggregatePaginate(
    Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      {
        $unwind: "$ownerDetails",
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "commentsDetails",
        },
      },
      {
        $unwind: {
          path: "$commentsDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "commentsDetails.owner",
          foreignField: "_id",
          as: "commentsDetails.ownerDetails",
        },
      },
      {
        $unwind: {
          path: "$commentsDetails.ownerDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "likes",
          let: { postId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$post", "$$postId"] } } },
            {
              $lookup: {
                from: "users",
                localField: "likedBy",
                foreignField: "_id",
                as: "likedByDetails",
              },
            },
            {
              $unwind: "$likedByDetails",
            },
          ],
          as: "likesDetails",
        },
      },
      {
        $group: {
          _id: "$_id",
          content: { $first: "$content" },
          postImage: { $first: "$postImage" },
          owner: { $first: "$owner" },
          ownerDetails: { $first: "$ownerDetails" },
          comments: {
            $push: {
              _id: "$commentsDetails._id",
              content: "$commentsDetails.content",
              owner: "$commentsDetails.owner",
              ownerDetails: "$commentsDetails.ownerDetails",
              createdAt: "$commentsDetails.createdAt",
              updatedAt: "$commentsDetails.updatedAt",
            },
          },
          likes: {
            $push: {
              _id: "$likesDetails._id",
              post: "$likesDetails.post",
              likedBy: "$likesDetails.likedBy",
              likedByDetails: "$likesDetails.likedByDetails",
              createdAt: "$likesDetails.createdAt",
              updatedAt: "$likesDetails.updatedAt",
            },
          },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          postImage: 1,
          owner: 1,
          ownerDetails: {
            _id: 1,
            username: 1,
            email: 1,
          },
          comments: {
            _id: 1,
            content: 1,
            owner: 1,
            ownerDetails: {
              _id: 1,
              username: 1,
              email: 1,
            },
            createdAt: 1,
            updatedAt: 1,
          },
          likes: {
            _id: 1,
            post: 1,
            likedBy: 1,
            likedByDetails: {
              _id: 1,
              username: 1,
              email: 1,
            },
            createdAt: 1,
            updatedAt: 1,
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]),
    { page, limit }
  );

  if (!posts) {
    throw new ApiError(404, "No posts found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post id");
  }

  const post = await findById(postId);

  if (!post) {
    throw new ApiError(404, "post not found");
  }

  if (post.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You do not have permission to delete this post");
  }

  await post.remove();

  await Comment.deleteMany({ post: postId });
  await Like.deleteMany({ post: postId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

export { createPost, updatePost, getAllPosts, deletePost };
