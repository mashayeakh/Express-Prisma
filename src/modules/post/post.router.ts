import express, { NextFunction, Request, Response } from "express";
import { PostController } from "./post.controller";
import { auth as betterAuth } from "../../lib/auth";
import { Role } from "../../types/Role";
import { authMiddleware } from "../../middleware/auth";

const router = express.Router();

//! production grade- try to put fixed routes first and semi-deynamic and and then full dynamic to avoid unnessary err. 


// router.get("/test", PostController.getTest);
router.post("/", authMiddleware(Role.USER, Role.ADMIN), PostController.createPost);
router.get("/", PostController.getAllPost);

// 1️⃣ fixed
router.get("/get-stats", PostController.getStats);

// 2️⃣ semi-dynamic
router.get("/by-author/:author", authMiddleware(Role.USER, Role.ADMIN), PostController.getPostByAuthor);
router.put("/by-author/:postId", authMiddleware(Role.USER, Role.ADMIN), PostController.updatePostByAuthor);

// 3️⃣ fully dynamic
router.get("/:id", PostController.getPostById);

router.delete("/delete/:postId", authMiddleware(Role.USER, Role.ADMIN), PostController.deleteUserPost);

export const PostRouter = router;