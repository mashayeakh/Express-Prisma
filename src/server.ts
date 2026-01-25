import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 3000;

// Export app for Vercel
export default app;

// Only run server in development
if (process.env.NODE_ENV !== "production") {
    async function main() {
        try {
            await prisma.$connect();
            console.log("Connected Successfully")
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            })
        } catch (error) {
            console.error("Connection Failed", error);
            await prisma.$disconnect();
            process.exit(1);
        }
    }

    main();
}