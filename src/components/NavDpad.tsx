'use client';

import React from 'react';
import { RemoteButton } from './RemoteButton';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Home,
  XSquare,
  Info,
} from 'lucide-react';
import { RemoteCommand } from '@/lib/tvProtocols/types';

interface NavDpadProps {
  onCommand: (cmd: RemoteCommand) => void;
  enableHaptics?: boolean;
  enableSound?: boolean;
}

export const NavDpad: React.FC<NavDpadProps> = ({
  onCommand,
  enableHaptics,
  enableSound,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center my-1 select-none">
      {/* Surround System Buttons Row: Back & Home */}
      <div className="w-full max-w-[280px] flex items-center justify-between px-3 mb-2">
        <RemoteButton
          variant="ghost"
          onPress={() => onCommand('BACK')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="w-12 h-10 rounded-2xl flex flex-col items-center justify-center gap-0.5 text-slate-300 hover:text-white"
          title="Voltar"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Voltar</span>
        </RemoteButton>

        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
          Navegação
        </span>

        <RemoteButton
          variant="ghost"
          onPress={() => onCommand('HOME')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="w-12 h-10 rounded-2xl flex flex-col items-center justify-center gap-0.5 text-cyan-400 hover:text-cyan-300"
          title="Início / Home"
        >
          <Home className="w-4 h-4" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Home</span>
        </RemoteButton>
      </div>

      {/* Main D-Pad Circular Wheel */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 p-2 shadow-dpad-ring border border-slate-700/60 flex items-center justify-center">
        {/* Subtle decorative inner ring */}
        <div className="absolute inset-4 rounded-full border border-slate-700/30 pointer-events-none" />

        {/* Up Button */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-14 flex items-center justify-center">
          <RemoteButton
            variant="dpad"
            hapticType="light"
            onPress={() => onCommand('UP')}
            enableHaptics={enableHaptics}
            enableSound={enableSound}
            className="w-full h-full rounded-t-full rounded-b-lg flex items-center justify-center pt-2 text-slate-300 hover:text-white"
            title="Para Cima"
          >
            <ChevronUp className="w-7 h-7" />
          </RemoteButton>
        </div>

        {/* Down Button */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-14 flex items-center justify-center">
          <RemoteButton
            variant="dpad"
            hapticType="light"
            onPress={() => onCommand('DOWN')}
            enableHaptics={enableHaptics}
            enableSound={enableSound}
            className="w-full h-full rounded-b-full rounded-t-lg flex items-center justify-center pb-2 text-slate-300 hover:text-white"
            title="Para Baixo"
          >
            <ChevronDown className="w-7 h-7" />
          </RemoteButton>
        </div>

        {/* Left Button */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-14 h-28 flex items-center justify-center">
          <RemoteButton
            variant="dpad"
            hapticType="light"
            onPress={() => onCommand('LEFT')}
            enableHaptics={enableHaptics}
            enableSound={enableSound}
            className="w-full h-full rounded-l-full rounded-r-lg flex items-center justify-center pl-2 text-slate-300 hover:text-white"
            title="Para Esquerda"
          >
            <ChevronLeft className="w-7 h-7" />
          </RemoteButton>
        </div>

        {/* Right Button */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-14 h-28 flex items-center justify-center">
          <RemoteButton
            variant="dpad"
            hapticType="light"
            onPress={() => onCommand('RIGHT')}
            enableHaptics={enableHaptics}
            enableSound={enableSound}
            className="w-full h-full rounded-r-full rounded-l-lg flex items-center justify-center pr-2 text-slate-300 hover:text-white"
            title="Para Direita"
          >
            <ChevronRight className="w-7 h-7" />
          </RemoteButton>
        </div>

        {/* Center OK / ENTER Button */}
        <RemoteButton
          variant="primary"
          hapticType="medium"
          soundType="enter"
          onPress={() => onCommand('ENTER')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-base shadow-lg shadow-cyan-500/25 active:scale-90 border-2 border-cyan-400/30 flex items-center justify-center z-10"
          title="OK / Confirmar"
        >
          <span>OK</span>
        </RemoteButton>
      </div>

      {/* Surround System Buttons Row: Exit & Info */}
      <div className="w-full max-w-[280px] flex items-center justify-between px-3 mt-2">
        <RemoteButton
          variant="ghost"
          onPress={() => onCommand('EXIT')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="w-12 h-10 rounded-2xl flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-rose-400"
          title="Sair"
        >
          <XSquare className="w-4 h-4" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Sair</span>
        </RemoteButton>

        <RemoteButton
          variant="ghost"
          onPress={() => onCommand('INFO')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="w-12 h-10 rounded-2xl flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-cyan-400"
          title="Informações / Guia"
        >
          <Info className="w-4 h-4" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Info</span>
        </RemoteButton>
      </div>
    </div>
  );
};
