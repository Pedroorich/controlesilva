'use client';

import React, { useState } from 'react';
import { RemoteButton } from './RemoteButton';
import { X, Hash, CornerDownLeft, Delete } from 'lucide-react';
import { RemoteCommand } from '@/lib/tvProtocols/types';

interface NumpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (cmd: RemoteCommand) => void;
  enableHaptics?: boolean;
  enableSound?: boolean;
}

export const NumpadModal: React.FC<NumpadModalProps> = ({
  isOpen,
  onClose,
  onCommand,
  enableHaptics,
  enableSound,
}) => {
  const [typedChannel, setTypedChannel] = useState('');

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    setTypedChannel((prev) => (prev.length < 4 ? prev + digit : prev));
    onCommand(digit as RemoteCommand);
  };

  const handleClear = () => {
    setTypedChannel('');
  };

  const handleConfirm = () => {
    onCommand('ENTER');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex flex-col p-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Teclado Numérico</h2>
            <p className="text-[11px] text-slate-400">Digite o número do canal da TV</p>
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

      {/* Channel Number Display */}
      <div className="my-4 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between px-6">
        <span className="text-xs uppercase tracking-wider text-slate-500 font-mono">Canal:</span>
        <span className="text-2xl font-bold font-mono tracking-widest text-cyan-400">
          {typedChannel || '—'}
        </span>
        {typedChannel && (
          <button
            type="button"
            onClick={handleClear}
            className="text-slate-400 hover:text-white"
          >
            <Delete className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 3x4 Numpad Grid */}
      <div className="grid grid-cols-3 gap-3 my-auto max-w-xs mx-auto w-full">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
          <RemoteButton
            key={num}
            variant="default"
            onPress={() => handleDigit(num)}
            enableHaptics={enableHaptics}
            enableSound={enableSound}
            className="h-16 rounded-2xl text-2xl font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-800"
          >
            {num}
          </RemoteButton>
        ))}

        {/* Clear */}
        <RemoteButton
          variant="ghost"
          onPress={handleClear}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="h-16 rounded-2xl text-xs font-semibold uppercase text-slate-400"
        >
          Limpar
        </RemoteButton>

        {/* 0 */}
        <RemoteButton
          variant="default"
          onPress={() => handleDigit('0')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="h-16 rounded-2xl text-2xl font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-800"
        >
          0
        </RemoteButton>

        {/* Enter / OK */}
        <RemoteButton
          variant="primary"
          onPress={handleConfirm}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="h-16 rounded-2xl flex items-center justify-center text-cyan-400"
        >
          <CornerDownLeft className="w-6 h-6" />
        </RemoteButton>
      </div>
    </div>
  );
};
