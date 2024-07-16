import { Router } from "express";
import { addCommentToPost } from "../controllers/comment.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:videoId").post(authenticate, addCommentToPost);

export default router;
