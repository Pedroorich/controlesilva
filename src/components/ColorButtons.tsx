'use client';

import React from 'react';
import { RemoteButton } from './RemoteButton';
import { RemoteCommand } from '@/lib/tvProtocols/types';

interface ColorButtonsProps {
  onCommand: (cmd: RemoteCommand) => void;
  enableHaptics?: boolean;
  enableSound?: boolean;
}

export const ColorButtons: React.FC<ColorButtonsProps> = ({
  onCommand,
  enableHaptics,
  enableSound,
}) => {
  return (
    <div className="w-full grid grid-cols-4 gap-2.5 px-2 my-1">
      {/* Red */}
      <RemoteButton
        variant="ghost"
        onPress={() => onCommand('RED')}
        enableHaptics={enableHaptics}
        enableSound={enableSound}
        className="h-7 rounded-full bg-red-600/30 hover:bg-red-600/50 border border-red-500/60 shadow-sm shadow-red-500/20"
        title="Botão Vermelho"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-glow-red" />
      </RemoteButton>

      {/* Green */}
      <RemoteButton
        variant="ghost"
        onPress={() => onCommand('GREEN')}
        enableHaptics={enableHaptics}
        enableSound={enableSound}
        className="h-7 rounded-full bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/60 shadow-sm shadow-emerald-500/20"
        title="Botão Verde"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
      </RemoteButton>

      {/* Yellow */}
      <RemoteButton
        variant="ghost"
        onPress={() => onCommand('YELLOW')}
        enableHaptics={enableHaptics}
        enableSound={enableSound}
        className="h-7 rounded-full bg-amber-500/30 hover:bg-amber-500/50 border border-amber-400/60 shadow-sm shadow-amber-500/20"
        title="Botão Amarelo"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
      </RemoteButton>

      {/* Blue */}
      <RemoteButton
        variant="ghost"
        onPress={() => onCommand('BLUE')}
        enableHaptics={enableHaptics}
        enableSound={enableSound}
        className="h-7 rounded-full bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/60 shadow-sm shadow-blue-500/20"
        title="Botão Azul"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
      </RemoteButton>
    </div>
  );
};
