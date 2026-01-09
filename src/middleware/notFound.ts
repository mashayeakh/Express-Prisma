import { Request, Response } from "express";

export function notFound(req: Request, res: Response) {
    res.json({
        message: "Route not found",
        path: req.path,
        date: new Date().toUTCString()
    })
}