import { create } from 'zustand';

type ClientState = {
  clientId: string | null;
  setClientId: (id: string) => void;
};

export const useClientStore = create<ClientState>((set) => ({
  clientId: null,
  setClientId: (id) => set({ clientId: id })
}));