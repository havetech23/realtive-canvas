// Front End
import React from 'react';
import { CanvasStage } from '~/components/CanvasStage';

import { socket } from '~/helper';
import { useRectStore, type Rect } from '~/store/rectStore';
import { useUserStore } from '~/store/userStore';

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomColor() { return `hsl(${rand(0, 360)} 80% 60%)`; }
function uid() { return crypto.randomUUID(); }

export default function RealTimeCanvas() {
  const upsert = useRectStore((s) => s.upsert);
  const users = useUserStore((s) => s.users);

  const handleAddRect = () => {
    const rect: Rect = {
      id: uid(),
      x: rand(20, 860),
      y: rand(20, 440),
      width: rand(60, 140),
      height: rand(40, 100),
      fill: randomColor()
    };
    upsert(rect);
    socket.emit('rectangle:add', rect);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-[var(--header-height)] flex items-center justify-between px-6 bg-white shadow-sm">
        <h1 className="text-xl font-semibold">Realtime Canvas</h1>
        <div className="flex items-center gap-6">
          <div className="flex gap-2 items-center text-sm text-slate-600">
            <span className="text-xs text-slate-500 mr-1">Users online: {users.length}</span>
            {users.map((u) => (
              <span key={u.id} className="px-2 py-1 bg-slate-200 rounded-lg">{u.name}</span>
            ))}
          </div>
          <button onClick={handleAddRect} className="px-4 py-2 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 shadow">
            Add Rectangle
          </button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-[1000px] mx-auto">
          <CanvasStage />
          <p className="mt-4 text-center text-sm text-slate-500">Open in multiple tabs to see user list, ownership labels, and live sync.</p>
        </div>
      </main>

      <footer className="p-4 text-center text-xs text-slate-400">React · Tailwind · Zustand · Konva · Socket.io</footer>
    </div>
  );
}