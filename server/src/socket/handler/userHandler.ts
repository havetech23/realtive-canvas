import { Server, Socket } from "socket.io";
import { rectangles, users, userSockets, socketToUserId } from "../state";
import { User } from "../../types/type";
export function registerUser(io: Server, socket: Socket, clientUserId: string) {
  const userId = clientUserId;
  let isNew = !users.has(userId);
  let user: User;

  if (isNew) {
    user = { id: userId, name: `User${users.size + 1}` };
    users.set(userId, user);
  } else {
    user = users.get(userId)!;
    if (user.timer) clearTimeout(user.timer);
    const oldSocketId = userSockets.get(userId);
    if (oldSocketId && oldSocketId !== socket.id) {
      socketToUserId.delete(oldSocketId);
    }
  }

  userSockets.set(userId, socket.id);
  socketToUserId.set(socket.id, userId);

  socket.emit("fullSync", {
    rectangles: Array.from(rectangles.values()),
    users: Array.from(users.values()).map(u => ({ id: u.id, name: u.name })),
    clientId: user.id,
  });

  if (isNew) {
    socket.broadcast.emit("user:connected", { id: user.id, name: user.name });
  }
}

export function requestSync(socket: Socket) {
  const userId = socketToUserId.get(socket.id);
  if (!userId) return;
  const user = users.get(userId);
  if (!user) return;

  socket.emit("fullSync", {
    rectangles: Array.from(rectangles.values()),
    users: Array.from(users.values()).map(u => ({ id: u.id, name: u.name })),
    clientId: user.id,
  });
}

export function handleDisconnect(io: Server, socket: Socket) {
  const userId = socketToUserId.get(socket.id);
  if (!userId) return;

  socketToUserId.delete(socket.id);
  if (userSockets.get(userId) === socket.id) {
    userSockets.delete(userId);

    // Release owned rectangles
    for (const rect of rectangles.values()) {
      if (rect.ownerId === userId) {
        rect.ownerId = undefined;
        rect.ownerName = undefined;
        io.emit("rectangle:released", { id: rect.id });
      }
    }

    const user = users.get(userId);
    if (user) {
      user.timer = setTimeout(() => {
        users.delete(userId);
        io.emit("user:disconnected", userId);
      }, 10000);
    }
  }
}
