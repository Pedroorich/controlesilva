'use client';

import React from 'react';
import { RemoteButton } from './RemoteButton';
import { Play, Pause, Square, FastForward, Rewind } from 'lucide-react';
import { RemoteCommand } from '@/lib/tvProtocols/types';

interface MediaControlsProps {
  onCommand: (cmd: RemoteCommand) => void;
  enableHaptics?: boolean;
  enableSound?: boolean;
}

export const MediaControls: React.FC<MediaControlsProps> = ({
  onCommand,
  enableHaptics,
  enableSound,
}) => {
  return (
    <div className="w-full flex items-center justify-between gap-2 px-2 py-1">
      {/* Rewind */}
      <RemoteButton
        variant="default"
        onPress={() => onCommand('REWIND')}
        enableHaptics={enableHaptics}
        enableSound={enableSound}
        className="flex-1 h-11 rounded-2xl flex items-center justify-center text-slate-300"
        title="Retroceder (Voltar)"
      >
        <Rewind className="w-4 h-4" />
      </RemoteButton>

      {/* Play */}
      <RemoteButton
        variant="default"
        onPress={() => onCommand('PLAY')}
        enableHaptics={enableHaptics}
        enableSound={enableSound}
        className="flex-1 h-11 rounded-2xl flex items-center justify-center text-emerald-400 bg-emerald-950/20 border-emerald-900/40 hover:bg-emerald-900/30"
        title="Reproduzir (Play)"
      >
        <Play className="w-4 h-4 fill-emerald-400 text-emerald-400" />
      </RemoteButton>

      {/* Pause */}
      <RemoteButton
        variant="default"
        onPress={() => onCommand('PAUSE')}
        enableHaptics={enableHaptics}
        enableSound={enableSound}
        className="flex-1 h-11 rounded-2xl flex items-center justify-center text-amber-400 bg-amber-950/20 border-amber-900/40 hover:bg-amber-900/30"
        title="Pausar"
      >
        <Pause className="w-4 h-4 fill-amber-400 text-amber-400" />
      </RemoteButton>

      {/* Stop */}
      <RemoteButton
        variant="default"
        onPress={() => onCommand('STOP')}
        enableHaptics={enableHaptics}
        enableSound={enableSound}
        className="flex-1 h-11 rounded-2xl flex items-center justify-center text-slate-300"
        title="Parar (Stop)"
      >
        <Square className="w-3.5 h-3.5 fill-slate-300 text-slate-300" />
      </RemoteButton>

      {/* Fast Forward */}
      <RemoteButton
        variant="default"
        onPress={() => onCommand('FAST_FORWARD')}
        enableHaptics={enableHaptics}
        enableSound={enableSound}
        className="flex-1 h-11 rounded-2xl flex items-center justify-center text-slate-300"
        title="Avançar Rápido"
      >
        <FastForward className="w-4 h-4" />
      </RemoteButton>
    </div>
  );
};
