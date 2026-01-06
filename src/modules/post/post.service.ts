import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client";
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

        // const updateViews = await prisma.post.update({
        //     where: {
        //         postId: id,
        //     },
        //     data: {
        //         views: {
        //             increment: 1, // just use this. it will increment by 1
        //         }
        //     }
        // })



        //we will be using tracnsaction here to make both the operations work together as we want both to be successful or none.
        return await prisma.$transaction(async (tx) => {
            //now we will increment the views when we land to specific post with id
            updateViews: await tx.post.update({
                where: {
                    postId: id,
                },
                data: {
                    views: {
                        increment: 1, // just use this. it will increment by 1
                    }
                }
            });
            return await tx.post.findUnique({
                where: {
                    postId: id,
                },
                include: {
                    comments: {
                        where: {
                            parentId: null,
                            status: CommentStatus.APPROVED
                        },
                        orderBy: {
                            createdAt: 'desc'
                        },
                        include: {
                            replies: {
                                where: {
                                    status: CommentStatus.APPROVED
                                },
                                orderBy: {
                                    createdAt: 'asc'
                                },
                                include: {
                                    replies: {

                                        where: {
                                            status: CommentStatus.APPROVED
                                        },
                                        orderBy: {
                                            createdAt: 'asc'
                                        },
                                    },

                                }
                            },
                            "_count": {
                                select: { replies: true }
                            }
                        }
                    },
                    "_count": {
                        select: { comments: true }
                    }
                },
            })
        })
    },

    async getPostByAuthor(authorId: string) {

        //check if the status is ACTIVE or not. 
        await prisma.user.findUniqueOrThrow({
            where: {
                id: authorId,
                status: "ACTIVE"
            },
            select: {
                id: true,
            }
        })


        const result = await prisma.post.findMany({
            where: {
                authorId: authorId
            },
            include: {
                _count: {
                    select: {
                        comments: true
                    }
                }
            }
        })

        const count = await prisma.post.count({
            where: {
                authorId: authorId
            },
        })

        const total = await prisma.post.aggregate({
            _count: {
                postId: true,
            },
            where: {
                authorId: authorId
            }
        })
        return {
            data: result,
            count: count,
            total: total
        }
    }
}