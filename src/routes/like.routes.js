import { Router } from "express";

import {
  togglePostLike,
  toggleCommentLike,
} from "../controllers/like.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.route("/toggle/p/:postId").post(togglePostLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);

export default router;
