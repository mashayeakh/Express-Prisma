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
            //------- for searching 
            const { search } = req.query;
            // console.log("Req query ---", search)

            //------ for getting tags
            const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
            // console.log("----", tags)
            const searchStr = typeof search === "string" ? search : undefined;

            //-----for getting isFeatured
            const isFeatured = req.query.isFeatured ? (req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined) : undefined;
            console.log(isFeatured) // boolean

            const result = await PostService.getAllPost({ search: searchStr, tags, isFeatured });
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