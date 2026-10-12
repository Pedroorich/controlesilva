'use client';

import React, { useState } from 'react';
import { RemoteButton } from './RemoteButton';
import { Volume2, VolumeX, Plus, Minus, ChevronUp, ChevronDown, Radio } from 'lucide-react';
import { RemoteCommand } from '@/lib/tvProtocols/types';

interface VolumeChannelSectionProps {
  onCommand: (cmd: RemoteCommand) => void;
  enableHaptics?: boolean;
  enableSound?: boolean;
}

export const VolumeChannelSection: React.FC<VolumeChannelSectionProps> = ({
  onCommand,
  enableHaptics,
  enableSound,
}) => {
  const [isMuted, setIsMuted] = useState(false);

  const handleMute = () => {
    setIsMuted(!isMuted);
    onCommand('MUTE');
  };

  return (
    <div className="w-full flex items-center justify-between gap-3 px-2 py-1">
      {/* Volume Rocker Container */}
      <div className="flex-1 flex flex-col items-center bg-slate-900/90 rounded-3xl p-1.5 border border-slate-800 shadow-remote-btn">
        <RemoteButton
          variant="rocker"
          hapticType="light"
          onPress={() => onCommand('VOLUME_UP')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="w-full h-14 rounded-2xl flex items-center justify-center text-slate-100"
          title="Aumentar Volume"
        >
          <Plus className="w-6 h-6" />
        </RemoteButton>

        <div className="py-2.5 flex flex-col items-center justify-center select-none">
          <Volume2 className="w-4 h-4 text-cyan-400 mb-0.5" />
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
            VOL
          </span>
        </div>

        <RemoteButton
          variant="rocker"
          hapticType="light"
          onPress={() => onCommand('VOLUME_DOWN')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="w-full h-14 rounded-2xl flex items-center justify-center text-slate-100"
          title="Diminuir Volume"
        >
          <Minus className="w-6 h-6" />
        </RemoteButton>
      </div>

      {/* Center Actions: Mute & Live Channels */}
      <div className="flex flex-col items-center justify-center gap-3">
        {/* Mute Button */}
        <RemoteButton
          variant={isMuted ? 'danger' : 'default'}
          hapticType="medium"
          soundType="toggle"
          onPress={handleMute}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
            isMuted ? 'ring-2 ring-red-500' : ''
          }`}
          title="Mudo / Desativar Som"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-red-300" />
          ) : (
            <VolumeX className="w-5 h-5 text-slate-300" />
          )}
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            {isMuted ? 'Mudo' : 'Mudo'}
          </span>
        </RemoteButton>

        {/* Previous Channel or Live TV */}
        <RemoteButton
          variant="ghost"
          hapticType="light"
          onPress={() => onCommand('PREV_CHANNEL')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1"
          title="Canal Anterior (Flashback)"
        >
          <Radio className="w-4 h-4 text-slate-400" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Anterior
          </span>
        </RemoteButton>
      </div>

      {/* Channel Rocker Container */}
      <div className="flex-1 flex flex-col items-center bg-slate-900/90 rounded-3xl p-1.5 border border-slate-800 shadow-remote-btn">
        <RemoteButton
          variant="rocker"
          hapticType="light"
          onPress={() => onCommand('CHANNEL_UP')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="w-full h-14 rounded-2xl flex items-center justify-center text-slate-100"
          title="Próximo Canal"
        >
          <ChevronUp className="w-6 h-6" />
        </RemoteButton>

        <div className="py-2.5 flex flex-col items-center justify-center select-none">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
            CANAL
          </span>
          <span className="text-[9px] text-slate-600 font-mono">CH</span>
        </div>

        <RemoteButton
          variant="rocker"
          hapticType="light"
          onPress={() => onCommand('CHANNEL_DOWN')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="w-full h-14 rounded-2xl flex items-center justify-center text-slate-100"
          title="Canal Anterior"
        >
          <ChevronDown className="w-6 h-6" />
        </RemoteButton>
      </div>
    </div>
  );
};
