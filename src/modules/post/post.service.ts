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

    async getAllPost(payload: { search?: string | undefined }) {
        const search = payload.search?.trim();

        const posts = await prisma.post.findMany({
            where: search
                ? {
                    // //search based on title, content and tags
                    // title: {
                    //     contains: payload.search as string,
                    //     mode: "insensitive",
                    // },
                    // content:{
                    //     contains: payload.search as string,
                    //     mode: "insensitive",
                    // } // this means both title and content should match the search string but we did not want that, what we wanted is either title or content to match the search string. For that we will use OR Operator. 
                    OR: [
                        {
                            title: { contains: search, mode: "insensitive" },
                        },
                        {
                            content: { contains: search, mode: "insensitive" },
                        },
                        {
                            tags: { has: search }, // hasSome also works if you have multiple search terms
                        },
                    ],
                }
                : {}, // if search is undefined, don't filter at all
        });

        return posts;
    }

}