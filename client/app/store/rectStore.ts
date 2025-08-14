import { create } from "zustand";

export type Rect = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  ownerId?: string;
  ownerName?: string;
};

type RectState = {
  rectangles: Record<string, Rect>;
  upsert: (r: Rect) => void;
  getAllBoxes: (arr: Rect[]) => void;
  move: (id: string, x: number, y: number) => void;
  claim: (id: string, by: { id: string; name: string }) => void;
  release: (id: string) => void;
};

export const useRectStore = create<RectState>((set) => ({
  rectangles: {},
  upsert: (r) => set((s) => ({ rectangles: { ...s.rectangles, [r.id]: r } })),
  getAllBoxes: (arr) =>
    set(() => ({
      rectangles: arr.reduce(
        (acc, r) => {
          acc[r.id] = r;
          return acc;
        },
        {} as Record<string, Rect>
      ),
    })),
  move: (id, x, y) =>
    set((s) => ({
      rectangles: { ...s.rectangles, [id]: { ...s.rectangles[id], x, y } },
    })),
  claim: (id, by) =>
    set((s) => ({
      rectangles: {
        ...s.rectangles,
        [id]: { ...s.rectangles[id], ownerId: by.id, ownerName: by.name },
      },
    })),
  release: (id) =>
    set((s) => ({
      rectangles: {
        ...s.rectangles,
        [id]: { ...s.rectangles[id], ownerId: undefined, ownerName: undefined },
      },
    })),
}));