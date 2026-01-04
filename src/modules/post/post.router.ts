import express, { NextFunction, Request, Response } from "express";
import { PostController } from "./post.controller";
import { auth as betterAuth } from "../../lib/auth";
import { Role } from "../../types/Role";
import { authMiddleware } from "../../middleware/auth";

const router = express.Router();


// router.get("/test", PostController.getTest);

router.post("/", authMiddleware(Role.USER), PostController.createPost);
router.get("/", PostController.getAllPost);
router.get("/:id", PostController.getPostById);


export const PostRouter = router;