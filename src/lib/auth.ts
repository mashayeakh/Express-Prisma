import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path
// import { PrismaClient } from "@/generated/prisma/client";

// const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [
        process.env.APP_URL!
    ],

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false,
            },
            phone: {
                type: "string",
                required: false,
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false,
            },
        }
    },
    emailAndPassword: {
        enabled: true,
        //i dont want use to sinin automatically
        autoSignIn: false,
        //every new user must verify email
        requireEmailVerification: true,
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {
            // void sendEmail({
            //     to: user.email,
            //     subject: "Verify your email address",
            //     text: `Click the link to verify your email: ${url}`,
            // });

            console.log("********************** Email send for verification")
        },
    },
});