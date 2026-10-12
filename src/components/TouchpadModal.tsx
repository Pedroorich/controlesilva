'use client';

import React, { useRef, useState } from 'react';
import { RemoteButton } from './RemoteButton';
import {
  X,
  MousePointer,
  RotateCcw,
  Home,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { RemoteCommand } from '@/lib/tvProtocols/types';

interface TouchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPointerMove: (dx: number, dy: number) => void;
  onPointerClick: () => void;
  onPointerScroll: (dy: number) => void;
  onCommand: (cmd: RemoteCommand) => void;
  enableHaptics?: boolean;
  enableSound?: boolean;
}

export const TouchpadModal: React.FC<TouchpadModalProps> = ({
  isOpen,
  onClose,
  onPointerMove,
  onPointerClick,
  onPointerScroll,
  onCommand,
  enableHaptics,
  enableSound,
}) => {
  const [sensitivity, setSensitivity] = useState(1.5);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);

  if (!isOpen) return null;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
      movedRef.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && lastTouchRef.current) {
      const touch = e.touches[0];
      const dx = (touch.clientX - lastTouchRef.current.x) * sensitivity;
      const dy = (touch.clientY - lastTouchRef.current.y) * sensitivity;

      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        movedRef.current = true;
        onPointerMove(Math.round(dx), Math.round(dy));
        lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
      }
    } else if (e.touches.length === 2 && lastTouchRef.current) {
      // 2 finger scroll
      const touch = e.touches[0];
      const dy = (touch.clientY - lastTouchRef.current.y) * 0.8;
      onPointerScroll(Math.round(dy));
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchEnd = () => {
    if (touchStartRef.current && !movedRef.current) {
      // Quick tap without significant movement -> Click / OK!
      onPointerClick();
    } else if (touchStartRef.current && lastTouchRef.current) {
      // Check for swipe gesture fallback
      const totalDx = lastTouchRef.current.x - touchStartRef.current.x;
      const totalDy = lastTouchRef.current.y - touchStartRef.current.y;
      const duration = Date.now() - touchStartRef.current.time;

      if (duration < 280) {
        if (Math.abs(totalDx) > 40 && Math.abs(totalDx) > Math.abs(totalDy)) {
          if (totalDx > 0) onCommand('RIGHT');
          else onCommand('LEFT');
        } else if (Math.abs(totalDy) > 40 && Math.abs(totalDy) > Math.abs(totalDx)) {
          if (totalDy > 0) onCommand('DOWN');
          else onCommand('UP');
        }
      }
    }

    touchStartRef.current = null;
    lastTouchRef.current = null;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex flex-col p-4 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <MousePointer className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Touchpad / Mouse Virtual</h2>
            <p className="text-[11px] text-slate-400">Arraste para mover o cursor, toque para OK</p>
          </div>
        </div>

        <RemoteButton
          variant="ghost"
          onPress={onClose}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="w-9 h-9 p-0 rounded-full"
        >
          <X className="w-5 h-5 text-slate-300" />
        </RemoteButton>
      </div>

      {/* Quick Nav row while in Touchpad mode */}
      <div className="flex items-center justify-between my-3 gap-2">
        <RemoteButton
          variant="ghost"
          onPress={() => onCommand('BACK')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="h-10 px-4 rounded-xl flex items-center gap-1.5 text-xs text-slate-300"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Voltar</span>
        </RemoteButton>

        <RemoteButton
          variant="primary"
          onPress={onPointerClick}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="h-10 px-6 rounded-xl flex items-center gap-1.5 text-xs font-semibold"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Clique (OK)</span>
        </RemoteButton>

        <RemoteButton
          variant="ghost"
          onPress={() => onCommand('HOME')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="h-10 px-4 rounded-xl flex items-center gap-1.5 text-xs text-cyan-400"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </RemoteButton>
      </div>

      {/* Main Touch Area */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex-1 w-full rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-2 border-slate-800 shadow-inner flex flex-col items-center justify-center select-none touch-none relative overflow-hidden group cursor-grab active:cursor-grabbing"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="flex flex-col items-center justify-center gap-2 pointer-events-none text-slate-500">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center animate-pulse">
            <MousePointer className="w-7 h-7 text-cyan-400/80" />
          </div>
          <span className="text-xs font-medium text-slate-400">Área de Toque do Cursor</span>
          <span className="text-[10px] text-slate-500">Deslize para mover • Toque rápido para clicar</span>
        </div>

        {/* Scroll helper side rail */}
        <div className="absolute right-2 top-10 bottom-10 w-8 rounded-full bg-slate-950/60 border border-slate-800/80 flex flex-col items-center justify-between py-2 text-[9px] text-slate-500 pointer-events-none">
          <span>▲</span>
          <span className="[writing-mode:vertical-lr] text-[9px] uppercase tracking-wider text-slate-400">
            Rolagem
          </span>
          <span>▼</span>
        </div>
      </div>

      {/* Bottom Sensitivity & Gesture Info */}
      <div className="mt-3 flex items-center justify-between px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-slate-500" />
          <span>Sensibilidade:</span>
          <button
            type="button"
            onClick={() => setSensitivity((s) => (s === 1 ? 1.5 : s === 1.5 ? 2.2 : 1))}
            className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-[11px]"
          >
            {sensitivity === 1 ? 'Suave' : sensitivity === 1.5 ? 'Normal' : 'Rápida'}
          </button>
        </div>
        <span className="text-[10px] text-slate-500">Swipe rápido aciona as setas</span>
      </div>
    </div>
  );
};
