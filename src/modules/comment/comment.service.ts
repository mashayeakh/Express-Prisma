import { prisma } from "../../lib/prisma";

export const CommentService = {
    async testComment() {
        return "Comment Service is working";
    },

    async createComment(payload: {
        content: string,
        author: string,
        postId: string,
        parentId: string
    }) {
        console.log("**** Create comment", payload)

        //find the postId from payload and check if it exists
        await prisma.post.findUniqueOrThrow({
            where: {
                postId: payload.postId
            }
        })

        //find the parentId from payload and check if it exists
        await prisma.comment.findFirstOrThrow({
            where: {
                commentId: payload.parentId
            }
        })

        return await prisma.comment.create({
            data: { ...payload }
        })
        // return result;
    }
}