import { Request, Response } from "express";
import { CommentService } from "./comment.service";
import { PostController } from "../post/post.controller";
import { REPLCommand } from "node:repl";

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
    },

    async deleteComment(req: Request, res: Response) {
        const authorId = req.user?.id;
        const { commentId } = req.params;
        const result = await CommentService.deleteCommentById(commentId as string, authorId as string);

        res.json(result);
    },

    async updateComment(req: Request, res: Response) {
        //only logged in user can update comment
        const authorId = req.user?.id;

        const { commentId } = req.params;
        const result = await CommentService.updateComment(commentId as string, authorId as string, req.body);
        res.json(result);
    },

    async moderateComment(req: Request, res: Response) {

        const { commentId } = req.params;
        const result = await CommentService.moderateComment(commentId as string, req.body);
        res.json(result);
    },

}