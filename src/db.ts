import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import { z } from "zod"

const Client = new PrismaClient();

interface signup {
    name     : string
    username : string
    password : string
}



export const createUser = async ({ username , password , name }: signup): Promise<boolean | string> => {
    const user = await Client.user.findUnique({
        where : {
            username : username
        }
    });

    if (!user) {
        return false;
    }

    const hashpassword = await bcrypt.hash(password,8);
    try {
        const User = await Client.user.create({
            data : {
                name,
                username,
                password : hashpassword
            }
        });
        return true
    } catch (error) {
        console.error("DB Error:", error);
        return "Database error";
    }
}

export const userSchema = z.object({
    name     : z.string().min(3).max(10),
    username : z.string().min(6).max(8),
    password : z.string().min(8).max(15)
})