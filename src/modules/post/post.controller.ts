import express, { Response, Request } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import { string, success } from "better-auth/*";
import { paginationSortingHelper } from "../../helper/paginationSortingHelper";

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
            // console.log(isFeatured) // boolean

            //----for getting status
            const status = req.query.status as PostStatus | undefined
            // console.log(status)

            // //---- for pagination we are accessing page and limit from query params
            // const page = Number(req.query.page ?? 0);
            // const limit = Number(req.query.limit ?? 10);

            // const skip = (page - 1) * limit;

            // //------ for sorting
            // const sortBy = req.query.sortBy as string | undefined
            // const sortOrder = req.query.sortOrder as string | undefined

            const { page, limit, sortBy, sortOrder, skip } = paginationSortingHelper(req.query);

            console.log("*** options", { page, limit, sortBy, sortOrder, skip })

            const result = await PostService.getAllPost({ search: searchStr, tags, isFeatured, status, page, limit, skip, sortBy, sortOrder });
            res.status(200).json({
                success: true,
                message: "Posts retrieved successfully",
                // count: result.length,
                data: result,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve posts",
                error: error.message,
            });
        }
    },

    async getPostById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await PostService.getPostById(id as string);
            res.status(200).json({
                success: true,
                message: "Post retrieved successfully",
                data: result,
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve post",
                error: err.message,
            });
        }
    },

    async getPostByAuthor(req: Request, res: Response) {
        try {
            const user = req?.user;
            if (!user) {
                throw new Error("User not authenticated");
            }
            return res.json({
                success: true,
                message: "Post retrieved successfully",
                data: await PostService.getPostByAuthor(user.id),
            })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve post",
                error: error.message,
            });
        }

    },

    async updatePostByAuthor(req: Request, res: Response) {
        try {
            const user = req?.user;
            console.log(user)
            if (!user) {
                throw new Error("User not authenticated");
            }
            const isAdmin = user.role === "ADMIN"
            console.log(user)
            return res.json({
                success: true,
                message: "Post updated successfully",
                data: await PostService.updatePostByAuthor(req.params.postId as string, req.body, user.id, isAdmin),
            })
        } catch (error: any) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: "Failed to update post",
                error: error.message,
            });
        }
    },

    async deleteUserPost(req: Request, res: Response) {
        try {
            const { postId } = req.params;
            const user = req?.user;
            const userId = req.user?.id;
            const isAdmin = user?.role === "ADMIN"


            return res.json({
                success: true,
                message: "Post deleted successfully",
                data: await PostService.deletePostByUser(postId as string, userId as string, isAdmin)
            })
        } catch (error: any) {
            // console.log(error)
            res.status(500).json({
                success: false,
                message: "Failed to delete post",
                error: error.message,
            });
        }
    },

    async getStats(req: Request, res: Response) {
        try {
            return res.json({
                success: true,
                message: "Stats fected successfully",
                data: await PostService.getStats()
            })

        } catch (error: any) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch stats",
                error: error.message,
            });
        }
    }
}