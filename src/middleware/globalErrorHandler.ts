import { NextFunction, Request, Response } from "express"

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500)
    // res.render('error', { error: err })
    res.json({
        message: "Error from error handler",
        error: err 
    })
}
