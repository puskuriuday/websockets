import { WebSocketServer } from "ws";
import express, { Request, Response, urlencoded } from "express";
const app = express();

// middlewares
app.use(express.json())
app.use(urlencoded({ extended : true }))


const wss = new WebSocketServer({port : 8080});

wss.on("connection",(socket) => {
    socket.on('message',(msg) => {
        console.log(msg.toString());
    });
});

app.post("/signup",(req: Request,res: Response) => {

});