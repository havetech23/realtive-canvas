import { Server, Socket } from "socket.io";
import { rectangles, socketToUserId, users } from "../state";
import { Rect } from "../../types/type";

export function addRectangle(socket: Socket, rect: Rect) {
  rectangles.set(rect.id, rect);
  socket.broadcast.emit("rectangle:added", rect);
}

export function moveRectangle(socket: Socket, data: { id: string; x: number; y: number }) {
  const rect = rectangles.get(data.id);
  if (rect) {
    rect.x = data.x;
    rect.y = data.y;
    socket.broadcast.emit("rectangle:moved", data);
  }
}

export function grabRectangle(io: Server, socket: Socket, data: { id: string }) {
  const userId = socketToUserId.get(socket.id);
  if (!userId) return;
  const user = users.get(userId);
  if (!user) return;
  const rect = rectangles.get(data.id);

  if (rect) {
    rect.ownerId = userId;
    rect.ownerName = user.name;
    io.emit("rectangle:grabbed", { id: data.id, by: { id: user.id, name: user.name } });
  }
}

export function releaseRectangle(io: Server, data: { id: string }) {
  const rect = rectangles.get(data.id);
  if (rect) {
    rect.ownerId = undefined;
    rect.ownerName = undefined;
    io.emit("rectangle:released", { id: rect.id });
  }
}
