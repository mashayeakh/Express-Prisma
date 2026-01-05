import express, { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../../lib/auth";
import { Role } from "../../types/Role";
import { CommentController } from "./comment.controller";
import { authMiddleware } from './../../middleware/auth';

const router = express.Router();


// router.get("/testComment", CommentController.getTestComment);


router.post("/", authMiddleware(Role.USER, Role.ADMIN), CommentController.createComment);




export const CommentRouter = router;