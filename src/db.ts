import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import { signin, signup, userType } from "./schema";

const Client = new PrismaClient();

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

export const findUser = async ({ username , password }: signin ): Promise<userType | boolean | string> => {
    try {
        const user = await Client.user.findUnique({
            where: {
                username
            }
        });
        if (!user) {
            return false
        }
        const verfyPassword = await bcrypt.compare(password,user.password)
        if (!verfyPassword) {
            return "Invalid username and password";
        }
        return user;
    } catch (error) {
        console.error("error : ", error)
        return "Database error";
    }
}