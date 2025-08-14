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

export type User = {
  id: string;
  name: string;
  timer?: NodeJS.Timeout;
};
