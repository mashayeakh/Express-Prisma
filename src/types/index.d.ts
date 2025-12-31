export declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: string;
                emailVerified: boolean;
            }
        }
    }
}


//we want only these fields when we create a post of an user thats why we have put these. We can change according to our need
