import express, { Response, Request } from "express";

export const RouteNotFound = {

    async notFound(req: Request, res: Response) {
        res.status(404).json({
            success: false,
            message: "Route not found",
            path: req.path,
        });
    }

}

