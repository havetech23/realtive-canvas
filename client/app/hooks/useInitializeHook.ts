
import { useEffect, useRef } from "react";
import { socket } from "~/helper";
import { useRectStore } from "../store/rectStore";
import { useUserStore, type User } from "../store/userStore";
import { useClientStore } from "../store/clientStore";
import type { Rect } from "../store/rectStore";

export function useSocketSync() {
  const { claim, move, release, upsert, getAllBoxes } = useRectStore();
  const { setUsers, users } = useUserStore();
  const { setClientId } = useClientStore();
  const subscribedRef = useRef(false);

  useEffect(() => {
    const handleFullSync = (data: {
      rectangles: Rect[];
      users: User[];
      clientId: string;
    }) => {
      console.log("Full sync received", data.rectangles.length);
      getAllBoxes(data.rectangles);
      setUsers(data.users);
      setClientId(data.clientId);
    };

    socket.on("fullSync", handleFullSync);

    const syncTimeout = setTimeout(() => {
      console.log("Requesting manual sync");
      socket.emit("requestSync");
    }, 2000);

    return () => {
      clearTimeout(syncTimeout);
      socket.off("fullSync", handleFullSync);
    };
  }, []);

  useEffect(() => {
    if (subscribedRef.current) return;
    subscribedRef.current = true;

    console.log("Subscribing to socket events");

    let userId = sessionStorage.getItem("userId");
    if (!userId) {
      userId = crypto.randomUUID();
      sessionStorage.setItem("userId", userId);
    }

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
      socket.emit("register", userId);
    });

    if (socket.connected) {
      socket.emit("register", userId);
    }

    socket.on("user:connected", (user: User) => {
      console.log("User connected:", user.name);
      setUsers([...users, user]);
    });

    socket.on("user:disconnected", (userId: string) => {
      console.log("User disconnected:", userId);
      setUsers(users.filter((u) => u.id !== userId));
    });

    socket.on("rectangle:added", (rect: Rect) => {
      console.log("New rectangle added:", rect.id);
      upsert(rect);
    });

    socket.on(
      "rectangle:moved",
      (data: { id: string; x: number; y: number }) => {
        move(data.id, data.x, data.y);
      }
    );

    socket.on("rectangle:grabbed", (data: { id: string; by: User }) => {
      claim(data.id, data.by);
    });

    socket.on("rectangle:released", (data: { id: string }) => {
      release(data.id);
    });

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("connect");
      socket.off("user:connected");
      socket.off("user:disconnected");
      socket.off("rectangle:added");
      socket.off("rectangle:moved");
      socket.off("rectangle:grabbed");
      socket.off("rectangle:released");
    };
  }, []);
}