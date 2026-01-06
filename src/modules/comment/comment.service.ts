import { prisma } from "../../lib/prisma";

export const CommentService = {
    async testComment() {
        return "Comment Service is working";
    },

    //create Comment
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
    },

    //get comment by id
    async getCommentsById(commentId: string) {
        return await prisma.comment.findUnique({
            where: {
                commentId: commentId
            }, include: {
                parent: true,
                post: {
                    select: {
                        postId: true,
                        title: true,
                        views: true,
                        thumbnail: true,
                    }
                },
            }
        })
        // console.log("comment by id", commentId)
    },

    //get comments by Author -> it means which comments are made by specific author

    async getCommentsByAuthor(author: string) {
        return await prisma.comment.findMany({
            where: {
                author: author
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                post: {
                    select: {
                        postId: true,
                        title: true,
                    }
                }

            }
        })
        // console.log("Auhor Id ", author)
    },

    //delete comment by id
    //Todo must be logged in 
    //TODO user should check if the comment belongs to him

    async deleteCommentById(commentId: string, authorId: string) {

        if (!commentId) {
            throw new Error("Comment ID is required");
        }

        if (!authorId) {
            throw new Error("Author ID is required");
        }

        //check if the comment belongs to the author
        const isCommentExist = await prisma.comment.findFirst({
            where: {
                commentId: commentId,
                author: authorId
            }
        })

        if (isCommentExist) {
            //delete the delete
            await prisma.comment.delete({
                where: {
                    commentId: commentId,
                },
                select: {
                    commentId: true
                }
            })
            return {
                message: "Comment deleted"
            }
        }
        return {
            message: "not found."
        }

        // console.log({ comment: commentId, author: authorId });
    }

}