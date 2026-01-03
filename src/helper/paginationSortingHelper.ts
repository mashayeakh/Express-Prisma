type IOptions = {
    page?: number | string;
    limit?: number | string;
    sortBy?: string;
    sortOrder?: string
}

type IResult = {
    page: number;
    limit: number;
    sortBy?: string | undefined;
    sortOrder?: string | undefined;
    skip: number;
}

export const paginationSortingHelper = (options: IOptions): IResult => {
    const page: number = Number(options.page ?? 1);
    const limit: number = Number(options.limit ?? 10);
    const sortBy: string | undefined = options.sortBy || "createdAt";
    const sortOrder: string | undefined = options.sortOrder;

    const skip = (page - 1) * limit;


    return {
        page,
        limit,
        sortBy,
        sortOrder,
        skip
    };
}