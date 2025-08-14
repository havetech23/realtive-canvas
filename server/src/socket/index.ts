import { Server } from "socket.io";
import { registerUser, requestSync, handleDisconnect } from "../socket/handler/userHandler";
import { addRectangle, moveRectangle, grabRectangle, releaseRectangle } from "../socket/handler/rectangleHandler";

export function socketConnection(io: Server) {
  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on("register", (clientUserId: string) => registerUser(io, socket, clientUserId));
    socket.on("requestSync", () => requestSync(socket));

    socket.on("rectangle:add", (rect) => addRectangle(socket, rect));
    socket.on("rectangle:move", (data) => moveRectangle(socket, data));
    socket.on("rectangle:grab", (data) => grabRectangle(io, socket, data));
    socket.on("rectangle:release", (data) => releaseRectangle(io, data));

    socket.on("disconnect", () => handleDisconnect(io, socket));
  });
}
