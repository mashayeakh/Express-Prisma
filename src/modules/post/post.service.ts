import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export const PostService = {
    //test
    async test() {
        return "Post Service is working"
    },

    async createPost(payload: Omit<Post, "postId" | "createdAt" | "updatedAt" | "views" | "authorId">, userId: string) {

        // console.log()

        const val = await prisma.post.create({ data: { ...payload, authorId: userId } })
        return val;
    },

    async getAllPost() {
        const posts = await prisma.post.findMany();
        return posts;
    }
}