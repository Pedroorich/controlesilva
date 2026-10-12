'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RemoteButton } from './RemoteButton';
import {
  X,
  Keyboard,
  Send,
  Trash2,
  CornerDownLeft,
  Delete,
  Space,
} from 'lucide-react';
import { RemoteCommand } from '@/lib/tvProtocols/types';

interface KeyboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendText: (text: string) => void;
  onCommand: (cmd: RemoteCommand) => void;
  enableHaptics?: boolean;
  enableSound?: boolean;
}

export const KeyboardModal: React.FC<KeyboardModalProps> = ({
  isOpen,
  onClose,
  onSendText,
  onCommand,
  enableHaptics,
  enableSound,
}) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!text.trim()) return;
    onSendText(text);
    setText('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex flex-col p-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Keyboard className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Teclado Virtual da TV</h2>
            <p className="text-[11px] text-slate-400">Digite no celular e envie para a TV</p>
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

      {/* Input area */}
      <div className="my-6 flex flex-col gap-3">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite o título, senha ou busca..."
            className="w-full h-14 px-4 pr-12 rounded-2xl bg-slate-900 border-2 border-cyan-500/40 focus:border-cyan-400 text-white placeholder-slate-500 text-base outline-none shadow-inner"
          />
          {text && (
            <button
              type="button"
              onClick={() => setText('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <RemoteButton
          variant="primary"
          hapticType="medium"
          soundType="enter"
          onPress={handleSend}
          disabled={!text.trim()}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm"
        >
          <Send className="w-4 h-4" />
          <span>Enviar Texto para a TV</span>
        </RemoteButton>
      </div>

      {/* Quick Navigation Control Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <RemoteButton
          variant="default"
          onPress={() => onCommand('BACK')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="h-11 rounded-xl flex items-center justify-center gap-1.5 text-xs text-slate-300"
        >
          <Delete className="w-4 h-4" />
          <span>Apagar / Back</span>
        </RemoteButton>

        <RemoteButton
          variant="default"
          onPress={() => onSendText(' ')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="h-11 rounded-xl flex items-center justify-center gap-1.5 text-xs text-slate-300"
        >
          <Space className="w-4 h-4" />
          <span>Espaço</span>
        </RemoteButton>

        <RemoteButton
          variant="default"
          onPress={() => onCommand('ENTER')}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="h-11 rounded-xl flex items-center justify-center gap-1.5 text-xs text-cyan-400"
        >
          <CornerDownLeft className="w-4 h-4" />
          <span>Confirmar (Enter)</span>
        </RemoteButton>
      </div>

      {/* Suggested quick chips */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] text-slate-500 font-medium">Sugestões rápidas:</span>
        <div className="flex flex-wrap gap-1.5">
          {['Filmes 4K', 'Netflix', 'Séries', 'Música', 'Trailer', 'Desenho'].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setText(chip)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
