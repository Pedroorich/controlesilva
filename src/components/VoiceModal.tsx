'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RemoteButton } from './RemoteButton';
import {
  X,
  Mic,
  MicOff,
  Send,
  Volume2,
  Tv,
  Sparkles,
} from 'lucide-react';
import { RemoteCommand } from '@/lib/tvProtocols/types';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendText: (text: string) => void;
  onCommand: (cmd: RemoteCommand) => void;
  onLaunchApp: (appId: string) => void;
  enableHaptics?: boolean;
  enableSound?: boolean;
}

// Typing for Web Speech API
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  onSendText,
  onCommand,
  onLaunchApp,
  enableHaptics,
  enableSound,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setTranscript('');
      setCommandFeedback(null);
      return;
    }

    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass =
        (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);

          // Check if speech matches quick commands
          const lower = currentTranscript.toLowerCase().trim();
          if (lower.includes('aumentar volume')) {
            onCommand('VOLUME_UP');
            setCommandFeedback('Comando reconhecido: Aumentar volume');
          } else if (lower.includes('diminuir volume')) {
            onCommand('VOLUME_DOWN');
            setCommandFeedback('Comando reconhecido: Diminuir volume');
          } else if (lower.includes('mudo') || lower.includes('silenciar')) {
            onCommand('MUTE');
            setCommandFeedback('Comando reconhecido: Mudo');
          } else if (lower.includes('netflix')) {
            onLaunchApp('netflix');
            setCommandFeedback('Comando reconhecido: Abrindo Netflix');
          } else if (lower.includes('youtube')) {
            onLaunchApp('youtube.leanback.v4');
            setCommandFeedback('Comando reconhecido: Abrindo YouTube');
          } else if (lower.includes('desligar tv') || lower.includes('desligar')) {
            onCommand('POWER_OFF');
            setCommandFeedback('Comando reconhecido: Desligar TV');
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [isOpen, onCommand, onLaunchApp, isListening]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Reconhecimento de voz não suportado neste navegador. Use o Chrome ou Safari no celular.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setCommandFeedback(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSendToTv = () => {
    if (!transcript.trim()) return;
    onSendText(transcript);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex flex-col p-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Comando por Voz</h2>
            <p className="text-[11px] text-slate-400">Dite para buscar ou fale um comando</p>
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

      {/* Main Microphone Center Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 my-4">
        {/* Pulsing Mic Circle */}
        <div className="relative">
          {isListening && (
            <>
              <div className="absolute inset-0 -m-4 rounded-full bg-purple-500/20 animate-ping" />
              <div className="absolute inset-0 -m-8 rounded-full bg-purple-500/10 animate-pulse" />
            </>
          )}

          <button
            type="button"
            onClick={toggleListening}
            className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 active:scale-95 ${
              isListening
                ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-purple-500/40 ring-4 ring-purple-400/30'
                : 'bg-slate-900 border-2 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
            }`}
          >
            {isListening ? <Mic className="w-12 h-12 animate-pulse" /> : <MicOff className="w-10 h-10" />}
          </button>
        </div>

        <span className="text-xs font-medium text-slate-400 text-center">
          {isListening ? 'Ouvindo... Fale agora' : 'Toque no microfone para falar'}
        </span>

        {/* Live Transcript Display */}
        <div className="w-full max-w-sm min-h-[90px] p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center">
          {commandFeedback ? (
            <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm animate-in fade-in">
              <Sparkles className="w-4 h-4" />
              <span>{commandFeedback}</span>
            </div>
          ) : transcript ? (
            <span className="text-white font-medium text-base leading-relaxed">
              &quot;{transcript}&quot;
            </span>
          ) : (
            <span className="text-slate-600 text-xs italic">
              Ex: &quot;Trailer Vingadores&quot;, &quot;Abrir Netflix&quot;, &quot;Aumentar volume&quot;
            </span>
          )}
        </div>

        {/* Send Button */}
        {transcript && (
          <RemoteButton
            variant="primary"
            onPress={handleSendToTv}
            enableHaptics={enableHaptics}
            enableSound={enableSound}
            className="h-12 px-6 rounded-2xl flex items-center gap-2 text-sm font-semibold animate-in zoom-in-95"
          >
            <Send className="w-4 h-4" />
            <span>Enviar &quot;{transcript}&quot; para a TV</span>
          </RemoteButton>
        )}
      </div>

      {/* Voice commands reference pills */}
      <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
        <span className="text-[11px] font-semibold text-slate-400">Comandos automáticos suportados:</span>
        <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-400">
          <span className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50">
            &quot;Abrir Netflix&quot;
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50">
            &quot;Abrir YouTube&quot;
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50">
            &quot;Aumentar volume&quot;
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50">
            &quot;Mudo&quot;
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50">
            &quot;Desligar TV&quot;
          </span>
        </div>
      </div>
    </div>
  );
};
