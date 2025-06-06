import { WebSocketServer } from "ws";
import express, { Request, Response, urlencoded } from "express";
import { signinSchema, userSchema, userType } from "./schema";
import { createUser, findUser } from "./db";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

const app = express();

// middlewares
app.use(express.json())
app.use(urlencoded({ extended : true }))
dotenv.config();

// const wss = new WebSocketServer({port : 3090});

// wss.on("connection",(socket) => {
//     socket.on('message',(msg) => {
//         console.log(msg.toString());
//     });
// });

//Global Catcher
app.use((req: Request, res: Response) => {
    res.status(404).json({
        msg: "Endpoint not found"
    });
});

app.post("/signup",async (req: Request,res: Response) => {
    const validInput = userSchema.safeParse(req.body);
    if (!validInput.success) {
        res.status(400).json({
            msg : "Invalid Input"
        });
        return
    }
    const user = await createUser(validInput.data);
    if (user === false) {
        res.status(409).json({
            msg : "username already exits"
        })
    } else if (user === "Database error") {
        res.status(500).json({
            msg : "DataBase error"
        });
    } else {
        res.status(200).json({
            msg : "User Created Successfully"
        });
    }
});

app.post("/signin", async (req: Request , res: Response) =>{
    const validInput = signinSchema.safeParse(req.body);
    if (!validInput.success) {
        res.status(400).json({
            msg : "Invalid input"
        });
        return
    }
    const user = await findUser(validInput.data);

    if (!user) {
        res.status(409).json({
            msg : "Username donot exits "
        });
    } else if (user === "Database error") {
        res.status(500).json({
            msg : "Database error"
        });
    } else if (user === "Invalid username and password") {
        res.status(405).json({
            msg : "Invalid username and password"
        })
    } else if (typeof user !== "string" && user !== true) {
        const userTyped = user as userType; 
        const token = jwt.sign({
            id : user.id
        },process.env.JWT_SECRET as string);

        res.status(200).json({
            msg: "Signin successful",
            token
        });
    }
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});