import express, { Response, Request } from "express";
import { PostService } from "./post.service";

export const PostController = {

    async getTest(req: Request, res: Response) {
        const result = await PostService.test();
        res.json({ message: result });
    },

    async createPost(req: Request, res: Response) {

        try {
            const result = await PostService.createPost(req.body);
            res.status(201).json({
                success: true,
                message: "Post created successfully",
                data: result,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: "Failed to create post",
                error: error.message,
            });
        }
    },

    async getAllPost(req: Request, res: Response) {
        try {
            const result = await PostService.getAllPost();
            res.status(200).json({
                success: true,
                message: "Posts retrieved successfully",
                count: result.length,
                data: result,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve posts",
                error: error.message,
            });
        }
    }

}