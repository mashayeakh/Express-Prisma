import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
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

    async getAllPost(payload: {
        search: string | undefined,
        tags: string[] | [],
        isFeatured: boolean | undefined,
        status: PostStatus | undefined,
        page: number,
        limit: number,
        skip: number,
        sortBy: string | undefined,
        sortOrder: string | undefined
    }) {

        const andCondi: PostWhereInput[] = [];

        if (payload.search) {
            andCondi.push({
                OR: [
                    {
                        title: {
                            contains: payload.search as string,
                            mode: "insensitive",
                        },
                    },
                    {
                        content: {
                            contains: payload.search as string,
                            mode: "insensitive",
                        }
                    },
                    {
                        tags: {
                            // contains: payload.search as string, // we cant do that as it is an string array. 

                            //for that we will use hasSome operator for case-insensitive search
                            has: payload.search as string,
                        }
                    }
                ],
            })
        }

        if (payload.tags) {
            andCondi.push({
                tags: {
                    hasEvery: payload.tags as string[],
                }
            })
        }

        if (typeof payload.isFeatured === 'boolean') {
            andCondi.push({
                isFeatured: payload.isFeatured
            });
        }

        if (payload.status) {
            andCondi.push({
                status: payload.status
            })
        }

        const posts = await prisma.post.findMany({
            take: payload.limit,
            skip: payload.skip,
            orderBy: payload.sortBy && payload.sortOrder ? {
                [payload.sortBy]: payload.sortOrder
            } : { createdAt: 'desc' },


            where: {
                // //search based on title, content and tags
                // title: {
                //     contains: payload.search as string,
                //     mode: "insensitive",
                // },
                // content:{
                //     contains: payload.search as string,
                //     mode: "insensitive",
                // } // this means both title and content should match the search string but we did not want that, what we wanted is either title or content to match the search string. For that we will use OR Operator. 
                AND: andCondi
            },

        });
        const total = await prisma.post.count({
            where: {
                AND: andCondi
            }
        });

        console.log(payload.page)
        return {
            data: posts,
            // count: posts.length,
            paginatin: {
                total: total,
                page: payload.page,
                limit: payload.limit,
                totalPage: Math.ceil(total / payload.limit),
            }
        }
    },
    async getPostById(id: string) {
        return await prisma.post.findUnique({
            where: {
                postId: id,
            }
        })
    }
}