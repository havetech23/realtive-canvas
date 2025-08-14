import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { socketConnection } from "./socket";

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

socketConnection(io);

export default server;
