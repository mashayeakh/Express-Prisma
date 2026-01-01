// Authentication & Authorization middleware
// This middleware:
// 1. Checks if the user is logged in (valid session)
// 2. Ensures the user's email is verified
// 3. Attaches the logged-in user info to req.user
// 4. Optionally restricts access based on user roles

import { NextFunction, Request, Response } from "express";
import { Role } from "../types/Role";
import { auth as betterAuth } from "../lib/auth";

// Usage example:
// router.post("/create", authMiddleware(Role.ADMIN), controller)
export const authMiddleware = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        try {

            //lets see the header, what is shows
            console.log("--------", req.headers)

            // Get the current session from Better Auth
            // The session is identified using cookies / headers sent by the client
            const session = await betterAuth.api.getSession({
                headers: req.headers as any
            });

            // If no session exists, the user is not logged in
            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized"
                });
            }

            // Block access if the user's email is not verified
            if (session.user.emailVerified === false) {
                return res.status(403).json({
                    success: false,
                    message: "Please verify your email to access this resource"
                });
            }

            // Attach user info to req.user
            // This allows easy access to user data in controllers
            // without fetching the session again
            req.user = {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: session.user.role as Role,
                emailVerified: session.user.emailVerified,
            };

            // If roles are provided, check whether the user has permission
            // Example: authMiddleware(Role.ADMIN)
            if (roles.length && !roles.includes(req.user.role as Role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden! You do not have permission to access this resource"
                });
            }

            // All checks passed, move to the next middleware or controller
            next();
        } catch (error) {
            next(error);
        }

    };
};
