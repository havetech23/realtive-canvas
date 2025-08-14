import { create } from 'zustand';

export type User = { id: string; name: string };

type UserState = {
  users: User[];
  setUsers: (list: User[]) => void;
};

export const useUserStore = create<UserState>((set) => ({
  users: [],
  setUsers: (list) => set({ users: list })
}));