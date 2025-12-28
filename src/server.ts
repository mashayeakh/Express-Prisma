import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 3000;

async function main() {
    try {
        //connect to database
        prisma.$connect();
        console.log("Connected Successfully")
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        })
    } catch (error) {
        console.error("Connection Failed", error);
        // disconnect from database
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();