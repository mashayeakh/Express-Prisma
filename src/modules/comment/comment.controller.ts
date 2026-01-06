import { Request, Response } from "express";
import { CommentService } from "./comment.service";
import { PostController } from "../post/post.controller";

export const CommentController = {
    async getTestComment(req: Request, res: Response) {
        const result = await CommentService.testComment();
        res.json({ message: result });
    },


    async createComment(req: Request, res: Response) {
        const user = req.user;
        console.log("User id in comment controller:", user);
        // console.log("***", req.body.)

        req.body.author = user?.id;

        //--------------- post 


        const result = await CommentService.createComment(req.body);
        res.json(result);
    },

    async getCommentsById(req: Request, res: Response) {
        const { commentId } = req.params;
        const result = await CommentService.getCommentsById(commentId as string);
        res.json(result);
    },

    async getCommentsByAuthor(req: Request, res: Response) {
        const { author } = req.params;
        res.json(
            await CommentService.getCommentsByAuthor(author as string
            )
        )
    }
}