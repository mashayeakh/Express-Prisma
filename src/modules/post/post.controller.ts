import express, { Response, Request } from "express";
import { PostService } from "./post.service";

export const PostController = {

    async getTest(req: Request, res: Response) {
        const result = await PostService.test();
        res.json({ message: result });
    },

    async createPost(req: Request, res: Response) {

        try {
            console.log(req.user)
            console.log(req.user?.id)
            const result = await PostService.createPost(req.body, req.user?.id as string);

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
            const { search } = req.query;
            // console.log("Req query ---", search)

            //for getting tags
            const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
            console.log("----", tags)

            const searchStr = typeof search === "string" ? search : undefined;

            const result = await PostService.getAllPost({ search: searchStr, tags });
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