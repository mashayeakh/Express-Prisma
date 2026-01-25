import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err)
    }
    let statusCode = 500;
    let errMessage = "Internal server error";
    let errDetails = err;


    //PrismaClientValidationError
    if (err instanceof Prisma.PrismaClientValidationError) {
        // change the code, errMsg
        statusCode = 400;
        errMessage = "You provided incorrect field type of missing fields"
    }

    //PrismaClientKnownRequestError
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            statusCode = 400;
            errMessage = "The specific record you are trying to access or modify does not exist."
        } else if (err.code === "P2002") {
            statusCode = 400;
            errMessage = "This record already exists. Please use a unique value."
        }
    }

    //PrismaClientUnknownRequestError
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        errMessage = "Error occurred during query execution"
    }

    res.status(statusCode)
    // res.render('error', { error: err })
    res.json({
        message: errMessage,
        error: errDetails
    })
}
