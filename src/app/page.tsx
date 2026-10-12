'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RemoteHeader } from '@/components/RemoteHeader';
import { PowerSection } from '@/components/PowerSection';
import { NavDpad } from '@/components/NavDpad';
import { VolumeChannelSection } from '@/components/VolumeChannelSection';
import { ColorButtons } from '@/components/ColorButtons';
import { MediaControls } from '@/components/MediaControls';
import { AppGrid } from '@/components/AppGrid';
import { TouchpadModal } from '@/components/TouchpadModal';
import { KeyboardModal } from '@/components/KeyboardModal';
import { VoiceModal } from '@/components/VoiceModal';
import { NumpadModal } from '@/components/NumpadModal';
import { SettingsModal } from '@/components/SettingsModal';
import { remoteManager } from '@/lib/tvProtocols/remoteManager';
import { lgClient } from '@/lib/tvProtocols/lgWebOS';
import {
  loadSettings,
  saveSettings,
  DEFAULT_SETTINGS,
} from '@/lib/deviceStore';
import {
  AppSettings,
  ConnectionStatus,
  RemoteCommand,
  TVDevice,
} from '@/lib/tvProtocols/types';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function RemoteControlPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTouchpadOpen, setIsTouchpadOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isNumpadOpen, setIsNumpadOpen] = useState(false);

  // Active Device
  const activeDevice =
    settings.devices.find((d) => d.id === settings.activeDeviceId) ||
    settings.devices[0];

  // Subscribe to LG WebOS connection status
  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);

    const unsubscribe = lgClient.subscribeStatus((newStatus, msg) => {
      setStatus(newStatus);
      if (msg) setStatusMessage(msg);
    });

    const active =
      loaded.devices.find((d) => d.id === loaded.activeDeviceId) ||
      loaded.devices[0];

    if (active) {
      remoteManager.setActiveDevice(active);
      // Attempt connection to the TV
      remoteManager.connect(active);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const handleReconnect = useCallback(() => {
    if (activeDevice) {
      remoteManager.connect(activeDevice);
    }
  }, [activeDevice]);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleConnectDevice = (device: TVDevice) => {
    remoteManager.connect(device);
  };

  const handleCommand = (cmd: RemoteCommand) => {
    remoteManager.sendCommand(cmd);
  };

  const handleLaunchApp = (appId: string) => {
    remoteManager.launchApp(appId);
  };

  const handleSendText = (text: string) => {
    remoteManager.sendText(text);
  };

  const handlePointerMove = (dx: number, dy: number) => {
    remoteManager.sendPointerMove(dx, dy);
  };

  const handlePointerClick = () => {
    remoteManager.sendPointerClick();
  };

  const handlePointerScroll = (dy: number) => {
    remoteManager.sendPointerScroll(dy);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start pb-8 select-none">
      <div className="w-full max-w-md flex flex-col items-center shadow-2xl min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-x border-slate-900 relative">
        {/* Top Header */}
        <RemoteHeader
          device={activeDevice}
          status={status}
          statusMessage={statusMessage}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenTouchpad={() => setIsTouchpadOpen(true)}
          onOpenKeyboard={() => setIsKeyboardOpen(true)}
          onOpenVoice={() => setIsVoiceOpen(true)}
          onOpenNumpad={() => setIsNumpadOpen(true)}
          onReconnect={handleReconnect}
          enableHaptics={settings.hapticsEnabled}
          enableSound={settings.soundEnabled}
        />

        {/* Pairing notification prompt */}
        {status === 'pairing_prompt' && (
          <div className="w-full px-4 pt-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-600/30 to-amber-700/20 border-2 border-amber-500/60 shadow-lg shadow-amber-500/10 flex items-start gap-3 animate-pulse">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-amber-300">Confirmação na TV necessária</h4>
                <p className="text-[11px] text-amber-100/90 leading-relaxed mt-0.5">
                  Uma mensagem de pareamento foi exibida na tela da sua TV LG. Clique em <strong>&quot;Permitir&quot;</strong> ou <strong>&quot;Sim&quot;</strong> usando as teclas da TV para liberar o acesso.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* HTTPS / SSL Helper Warning if disconnected */}
        {status === 'error' && (
          <div className="w-full px-4 pt-3">
            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block text-rose-300">Não foi possível conectar</span>
                <span className="text-[11px] text-rose-200/80 leading-tight block mt-0.5">
                  Certifique-se de que a TV está no mesmo Wi-Fi. Abra as Configurações ⚙️ no topo para conferir o IP ou aceitar o certificado SSL.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Main Remote Layout */}
        <div className="w-full px-4 flex flex-col gap-4 mt-3">
          {/* Power & Source Section */}
          <PowerSection
            onCommand={handleCommand}
            enableHaptics={settings.hapticsEnabled}
            enableSound={settings.soundEnabled}
          />

          {/* D-Pad Navigation Wheel */}
          <NavDpad
            onCommand={handleCommand}
            enableHaptics={settings.hapticsEnabled}
            enableSound={settings.soundEnabled}
          />

          {/* Volume & Channel Rockers */}
          <VolumeChannelSection
            onCommand={handleCommand}
            enableHaptics={settings.hapticsEnabled}
            enableSound={settings.soundEnabled}
          />

          {/* Color Buttons */}
          <ColorButtons
            onCommand={handleCommand}
            enableHaptics={settings.hapticsEnabled}
            enableSound={settings.soundEnabled}
          />

          {/* Media Playback Controls */}
          <MediaControls
            onCommand={handleCommand}
            enableHaptics={settings.hapticsEnabled}
            enableSound={settings.soundEnabled}
          />

          {/* Streaming App Launchers */}
          <AppGrid
            onLaunchApp={handleLaunchApp}
            enableHaptics={settings.hapticsEnabled}
            enableSound={settings.soundEnabled}
          />
        </div>

        {/* Bottom PWA Info / Footer */}
        <footer className="w-full py-4 text-center text-[10px] text-slate-600 flex flex-col items-center gap-1">
          <span>Controle Remoto Universal Smart TV • LG webOS</span>
          <span>Dica: Adicione à Tela de Início do celular para usar como aplicativo</span>
        </footer>
      </div>

      {/* Interactive Feature Modals */}
      <TouchpadModal
        isOpen={isTouchpadOpen}
        onClose={() => setIsTouchpadOpen(false)}
        onPointerMove={handlePointerMove}
        onPointerClick={handlePointerClick}
        onPointerScroll={handlePointerScroll}
        onCommand={handleCommand}
        enableHaptics={settings.hapticsEnabled}
        enableSound={settings.soundEnabled}
      />

      <KeyboardModal
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onSendText={handleSendText}
        onCommand={handleCommand}
        enableHaptics={settings.hapticsEnabled}
        enableSound={settings.soundEnabled}
      />

      <VoiceModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onSendText={handleSendText}
        onCommand={handleCommand}
        onLaunchApp={handleLaunchApp}
        enableHaptics={settings.hapticsEnabled}
        enableSound={settings.soundEnabled}
      />

      <NumpadModal
        isOpen={isNumpadOpen}
        onClose={() => setIsNumpadOpen(false)}
        onCommand={handleCommand}
        enableHaptics={settings.hapticsEnabled}
        enableSound={settings.soundEnabled}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onConnectDevice={handleConnectDevice}
        enableHaptics={settings.hapticsEnabled}
        enableSound={settings.soundEnabled}
      />
    </main>
  );
}
