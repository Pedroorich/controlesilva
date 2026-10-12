'use client';

import React from 'react';
import { ConnectionStatus, TVDevice } from '@/lib/tvProtocols/types';
import { RemoteButton } from './RemoteButton';
import {
  Tv,
  Settings,
  Mic,
  Keyboard,
  MousePointer,
  Hash,
  Wifi,
  WifiOff,
  RefreshCw,
} from 'lucide-react';

interface RemoteHeaderProps {
  device: TVDevice;
  status: ConnectionStatus;
  statusMessage: string;
  onOpenSettings: () => void;
  onOpenTouchpad: () => void;
  onOpenKeyboard: () => void;
  onOpenVoice: () => void;
  onOpenNumpad: () => void;
  onReconnect: () => void;
  enableHaptics?: boolean;
  enableSound?: boolean;
}

export const RemoteHeader: React.FC<RemoteHeaderProps> = ({
  device,
  status,
  statusMessage,
  onOpenSettings,
  onOpenTouchpad,
  onOpenKeyboard,
  onOpenVoice,
  onOpenNumpad,
  onReconnect,
  enableHaptics,
  enableSound,
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Conectado ({device.ip})
          </span>
        );
      case 'pairing_prompt':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-medium animate-bounce">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Aceite na tela da TV!
          </span>
        );
      case 'connecting':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-medium">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Conectando...
          </span>
        );
      case 'error':
      default:
        return (
          <button
            onClick={onReconnect}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <WifiOff className="w-3 h-3" />
            Desconectado (Toque p/ conectar)
          </button>
        );
    }
  };

  return (
    <header className="w-full flex flex-col gap-2.5 px-4 pt-3 pb-2 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-500/20">
            <Tv className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              LG Magic Web Remote
              <span className="text-[10px] bg-red-950 text-red-300 border border-red-800/50 px-1.5 py-0.2 rounded font-mono">
                webOS
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 truncate max-w-[170px]">{device.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <RemoteButton
            variant="ghost"
            onPress={onOpenSettings}
            enableHaptics={enableHaptics}
            enableSound={enableSound}
            className="w-9 h-9 p-0"
            title="Configurações da TV e Rede"
          >
            <Settings className="w-4 h-4 text-slate-300" />
          </RemoteButton>
        </div>
      </div>

      {/* Connection status bar */}
      <div className="flex items-center justify-between gap-2">
        {getStatusBadge()}

        {/* Quick Mode Toolbar */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/60">
          <RemoteButton
            variant="ghost"
            onPress={onOpenTouchpad}
            enableHaptics={enableHaptics}
            enableSound={enableSound}
            className="w-7 h-7 p-0 rounded-lg text-slate-400 hover:text-cyan-400"
            title="Modo Touchpad / Trackpad"
          >
            <MousePointer className="w-3.5 h-3.5" />
          </RemoteButton>

          <RemoteButton
            variant="ghost"
            onPress={onOpenKeyboard}
            enableHaptics={enableHaptics}
            enableSound={enableSound}
            className="w-7 h-7 p-0 rounded-lg text-slate-400 hover:text-cyan-400"
            title="Digitar no Teclado"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </RemoteButton>

          <RemoteButton
            variant="ghost"
            onPress={onOpenVoice}
            enableHaptics={enableHaptics}
            enableSound={enableSound}
            className="w-7 h-7 p-0 rounded-lg text-slate-400 hover:text-cyan-400"
            title="Comando por Voz"
          >
            <Mic className="w-3.5 h-3.5" />
          </RemoteButton>

          <RemoteButton
            variant="ghost"
            onPress={onOpenNumpad}
            enableHaptics={enableHaptics}
            enableSound={enableSound}
            className="w-7 h-7 p-0 rounded-lg text-slate-400 hover:text-cyan-400"
            title="Teclado Numérico de Canais"
          >
            <Hash className="w-3.5 h-3.5" />
          </RemoteButton>
        </div>
      </div>

      {statusMessage && status !== 'connected' && (
        <div className="text-[11px] text-slate-400 bg-slate-950/40 px-2 py-1 rounded border border-slate-800/40 truncate">
          {statusMessage}
        </div>
      )}
    </header>
  );
};
