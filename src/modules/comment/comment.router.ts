import express, { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../../lib/auth";
import { Role } from "../../types/Role";
import { CommentController } from "./comment.controller";
import { authMiddleware } from './../../middleware/auth';

const router = express.Router();


// router.get("/testComment", CommentController.getTestComment);


router.post("/", authMiddleware(Role.USER, Role.ADMIN), CommentController.createComment);

router.get("/:commentId", CommentController.getCommentsById);

// get comments by author
router.get("/author/:author", CommentController.getCommentsByAuthor);

//delete comment by id
router.delete("/:commentId", authMiddleware(Role.ADMIN, Role.USER), CommentController.deleteComment);


export const CommentRouter = router;