'use client';

import React, { useState } from 'react';
import { RemoteButton } from './RemoteButton';
import { Power, Tv, Settings2, Sliders, ChevronDown } from 'lucide-react';
import { RemoteCommand } from '@/lib/tvProtocols/types';

interface PowerSectionProps {
  onCommand: (cmd: RemoteCommand) => void;
  enableHaptics?: boolean;
  enableSound?: boolean;
}

export const PowerSection: React.FC<PowerSectionProps> = ({
  onCommand,
  enableHaptics,
  enableSound,
}) => {
  const [showInputs, setShowInputs] = useState(false);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        {/* Power Button */}
        <RemoteButton
          variant="danger"
          hapticType="heavy"
          soundType="power"
          onPress={() => onCommand('POWER_OFF')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="h-12 flex-1 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm"
          title="Desligar TV"
        >
          <Power className="w-5 h-5 text-white" />
          <span>Ligar / Desligar</span>
        </RemoteButton>

        {/* Input / HDMI Source selector toggle */}
        <RemoteButton
          variant="default"
          hapticType="medium"
          onPress={() => setShowInputs(!showInputs)}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="h-12 px-4 rounded-2xl flex items-center justify-center gap-1.5 text-xs text-slate-200"
          title="Entradas de Vídeo (HDMI, TV)"
        >
          <Tv className="w-4 h-4 text-cyan-400" />
          <span>Entradas</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
              showInputs ? 'rotate-180' : ''
            }`}
          />
        </RemoteButton>

        {/* Menu / Settings */}
        <RemoteButton
          variant="default"
          onPress={() => onCommand('MENU')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="h-12 w-12 rounded-2xl flex items-center justify-center text-slate-200 p-0"
          title="Abrir Menu da TV"
        >
          <Settings2 className="w-5 h-5 text-slate-300" />
        </RemoteButton>
      </div>

      {/* Collapsible Input list */}
      {showInputs && (
        <div className="grid grid-cols-5 gap-1.5 p-2 bg-slate-950/70 border border-slate-800/80 rounded-2xl animate-in fade-in slide-in-from-top-1">
          <RemoteButton
            variant="ghost"
            onPress={() => {
              onCommand('INPUT_HDMI1');
              setShowInputs(false);
            }}
            enableHaptics={enableHaptics}
            enableSound={enableSound}
            className="h-9 text-[11px] font-bold rounded-xl"
          >
            HDMI 1
          </RemoteButton>
          <RemoteButton
            variant="ghost"
            onPress={() => {
              onCommand('INPUT_HDMI2');
              setShowInputs(false);
            }}
            enableHaptics={enableHaptics}
            enableSound={enableSound}
            className="h-9 text-[11px] font-bold rounded-xl"
          >
            HDMI 2
          </RemoteButton>
          <RemoteButton
            variant="ghost"
            onPress={() => {
              onCommand('INPUT_HDMI3');
              setShowInputs(false);
            }}
            enableHaptics={enableHaptics}
            enableSound={enableSound}
            className="h-9 text-[11px] font-bold rounded-xl"
          >
            HDMI 3
          </RemoteButton>
          <RemoteButton
            variant="ghost"
            onPress={() => {
              onCommand('INPUT_TV');
              setShowInputs(false);
            }}
            enableHaptics={enableHaptics}
            enableSound={enableSound}
            className="h-9 text-[11px] font-bold rounded-xl"
          >
            TV
          </RemoteButton>
          <RemoteButton
            variant="ghost"
            onPress={() => {
              onCommand('INPUT_AV');
              setShowInputs(false);
            }}
            enableHaptics={enableHaptics}
            enableSound={enableSound}
            className="h-9 text-[11px] font-bold rounded-xl"
          >
            AV
          </RemoteButton>
        </div>
      )}
    </div>
  );
};
