import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            id ?: string
        }
    }
}

export const auth = async (req: Request , res: Response , next: NextFunction) => {
    const token = req.headers["token"] as string;

    if (!token) {
        return res.status(401).json({ error: "Token is missing" });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(401).json({ error: "JWT secret is not defined" });
    }
    try {
        const verifition = Jwt.verify(token, process.env.JWT_SECRET) as Jwt.JwtPayload;
        req.id = verifition.id
        next();
    } catch (error) {
        console.error("error : ", error)
        res.status(500).json({
            msg : "Error while verifing user"
        });
    }

}