import { WebSocketServer } from "ws";
import express, { Request, Response, urlencoded } from "express";
import { createUser, userSchema } from "./db";
const app = express();

// middlewares
app.use(express.json())
app.use(urlencoded({ extended : true }))
app.use((req: Request, res: Response) => {
    res.status(404).json({
        msg: "Endpoint not found"
    });
});


const wss = new WebSocketServer({port : 8080});

wss.on("connection",(socket) => {
    socket.on('message',(msg) => {
        console.log(msg.toString());
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
        });
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

