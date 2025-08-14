import { socket } from "~/helper";

export const SocketService = {
  emitMove: (id: string, x: number, y: number) => {
    socket.emit("rectangle:move", { id, x, y });
  },
  emitGrab: (id: string) => {
    socket.emit("rectangle:grab", { id });
  },
  emitRelease: (id: string) => {
    socket.emit("rectangle:release", { id });
  },
  requestSync: () => {
    socket.emit("requestSync");
  },
  register: (userId: string) => {
    socket.emit("register", userId);
  },
};