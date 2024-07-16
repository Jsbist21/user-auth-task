import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createPost,
  updatePost,
  getAllPosts,
  deletePost,
} from "../controllers/post.controller.js";

const router = Router();

router
  .route("/")
  .get(getAllPosts)
  .post(authenticate, upload.single("postImage"), createPost);

router
  .route("/p/:postId")
  .patch(authenticate, updatePost)
  .delete(authenticate, deletePost);

export default router;
