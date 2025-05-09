import { z } from "zod";

export interface signup {
    name     : string
    username : string
    password : string
}

export interface userType {
    id      : number
    name    : string
    username: string
    password: string
}

export interface signin {
    username: string
    password: string
}

export const userSchema = z.object({
    name     : z.string().min(3).max(10),
    username : z.string().min(6).max(8),
    password : z.string().min(8).max(15)
});

export const signinSchema = z.object({
    username : z.string().min(6).max(8),
    password : z.string().min(8).max(15)
});