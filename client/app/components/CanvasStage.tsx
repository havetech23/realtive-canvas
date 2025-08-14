// components/CanvasStage.tsx
import React, { useMemo } from "react";
import { Stage, Layer } from "react-konva";
import { useRectStore } from "../store/rectStore";
import { useSocketSync } from "../hooks/useInitializeHook";
import { Rectangle } from "./Rectangle";
import { socket } from "~/helper";

const CANVAS_W = 960;
const CANVAS_H = 540;

export function CanvasStage() {
  const { rectangles, move, release } = useRectStore();
  useSocketSync();

  const handleDragMove = (id: string, x: number, y: number) => {
    move(id, x, y);
    socket.emit("rectangle:move", { id, x, y });
  };

  const list = useMemo(() => Object.values(rectangles), [rectangles]);

  return (
    <div className="w-full flex justify-center">
      <Stage
        width={CANVAS_W}
        height={CANVAS_H}
        className="rounded-2xl shadow bg-white"
      >
        <Layer>
          {list.map((rect) => (
            <Rectangle
              key={rect.id}
              rect={rect}
              onDragMove={handleDragMove}
              onRelease={release}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}