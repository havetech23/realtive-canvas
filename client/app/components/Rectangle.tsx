// components/Rectangle.tsx
import React from "react";
import type { Rect } from "../store/rectStore";
import { Rect as KonvaRect, Text as KonvaText } from "react-konva";
import { socket } from "~/helper";

interface RectangleProps {
  rect: Rect;
  onDragMove: (id: string, x: number, y: number) => void;
  onRelease: (id: string) => void;
}

export const Rectangle: React.FC<RectangleProps> = ({
  rect,
  onDragMove,
  onRelease,
}) => {
  return (
    <>
      <KonvaRect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        fill={rect.fill}
        stroke={rect.ownerId ? "#111827" : undefined}
        strokeWidth={rect.ownerId ? 3 : 0}
        draggable={true}
        onDragStart={() => {
          socket.emit("rectangle:grab", { id: rect.id });
        }}
        onDragMove={(e) => {
          onDragMove(rect.id, e.target.x(), e.target.y());
        }}
        onDragEnd={() => {
          socket.emit("rectangle:release", { id: rect.id });
          onRelease(rect.id);
        }}
      />
      {rect.ownerName && (
        <KonvaText
          x={rect.x}
          y={rect.y - 18}
          text={`${rect.ownerName} is moving`}
          fontSize={12}
        />
      )}
    </>
  );
};