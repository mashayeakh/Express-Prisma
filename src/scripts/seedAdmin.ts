import { prisma } from "../lib/prisma";
import { Role } from "../types/Role";

async function seedAdmin() {
    try {
        //check if admin user already exists
        console.log("***** Seeding started.")
        const existingAdmin = {
            name: "Admin User4",
            email: "admin@admin4.com",
            password: "admin12345",
            role: Role.ADMIN,
            emailVerified: true,
        }

        console.log("***** checking duplicated email");
        const emailCheck = await prisma.user.findUnique({
            where: {
                email: existingAdmin.email,
            }
        })

        if (emailCheck) {
            //throw an err
            throw new Error("Admin user already exists");
        }

        //else create the admin. We could have used the admin using "create" from prisma however, we wont be doing that so we will go with using api (http://localhost:5000/api/auth/sign-up/email) from better auth and try to create in the terminal.
        console.log("***** ✅ duplication failed, email about to be seeding now.");
        const response = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(existingAdmin)
        });

        console.log("******Response", response)

        if (response.ok) {
            console.log("Admin user seeded successfully");
            //update the email Verification.
            const updateUser = await prisma.user.update({
                where: {
                    email: existingAdmin.email,
                },
                //update the data (email verification = true)
                data: {
                    emailVerified: true,
                }
            })
            console.log("*******Email verified as well. ")
        }
        else {
            console.log("*******Failed to seed admin user");
        }

    } catch (error: any) {
        console.error("******* Error seeding admin user:", error.message);
    }
}

seedAdmin();