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
import { ConnectionBanner } from '@/components/ConnectionBanner';
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

        {/* Connection status and Assistant Banner */}
        <ConnectionBanner
          status={status}
          statusMessage={statusMessage}
          device={activeDevice}
          onReconnect={handleReconnect}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

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
