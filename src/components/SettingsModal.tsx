'use client';

import React, { useState } from 'react';
import { RemoteButton } from './RemoteButton';
import {
  X,
  Settings,
  Tv,
  Wifi,
  ShieldCheck,
  Volume2,
  Vibrate,
  HelpCircle,
  ExternalLink,
  Plus,
  Trash2,
  Check,
} from 'lucide-react';
import { AppSettings, TVDevice } from '@/lib/tvProtocols/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onConnectDevice: (device: TVDevice) => void;
  enableHaptics?: boolean;
  enableSound?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onConnectDevice,
  enableHaptics,
  enableSound,
}) => {
  const activeDevice =
    settings.devices.find((d) => d.id === settings.activeDeviceId) ||
    settings.devices[0] || {
      id: 'tv_default',
      name: 'Smart TV LG',
      brand: 'lg_webos',
      ip: '192.168.1.100',
      port: 3001,
    };

  const [tvName, setTvName] = useState(activeDevice.name);
  const [tvIp, setTvIp] = useState(activeDevice.ip);
  const [tvPort, setTvPort] = useState(activeDevice.port || 3001);
  const [haptics, setHaptics] = useState(settings.hapticsEnabled);
  const [sound, setSound] = useState(settings.soundEnabled);
  const [showGuide, setShowGuide] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updatedDevice: TVDevice = {
      ...activeDevice,
      name: tvName.trim() || 'Smart TV LG',
      ip: tvIp.trim(),
      port: Number(tvPort) || 3001,
      brand: 'lg_webos',
    };

    const updatedDevices = settings.devices.map((d) =>
      d.id === updatedDevice.id ? updatedDevice : d
    );

    const updatedSettings: AppSettings = {
      ...settings,
      hapticsEnabled: haptics,
      soundEnabled: sound,
      devices: updatedDevices,
      activeDeviceId: updatedDevice.id,
    };

    onSaveSettings(updatedSettings);
    onConnectDevice(updatedDevice);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleOpenCertWindow = () => {
    if (!tvIp) return;
    // LG webOS SSL port is 3001
    const certUrl = `https://${tvIp.trim()}:3001`;
    window.open(certUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex flex-col p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Configurações & Rede</h2>
            <p className="text-[11px] text-slate-400">Configure o IP da sua Smart TV LG</p>
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

      <div className="flex flex-col gap-5 my-4">
        {/* Device Info Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white flex items-center gap-2">
              <Tv className="w-4 h-4 text-cyan-400" />
              Dados da TV LG
            </span>
            <span className="text-[10px] text-red-400 bg-red-950/60 border border-red-900/60 px-2 py-0.5 rounded-full font-mono">
              LG webOS SSAP
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400">Nome do Aparelho:</label>
            <input
              type="text"
              value={tvName}
              onChange={(e) => setTvName(e.target.value)}
              placeholder="Ex: TV da Sala"
              className="w-full h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-cyan-400 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-slate-400">Endereço IP da TV:</label>
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                Como achar o IP?
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tvIp}
                onChange={(e) => setTvIp(e.target.value)}
                placeholder="Ex: 192.168.1.100"
                className="flex-1 h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:border-cyan-400 outline-none"
              />
              <input
                type="number"
                value={tvPort}
                onChange={(e) => setTvPort(Number(e.target.value))}
                placeholder="3001"
                className="w-20 h-11 px-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm text-center focus:border-cyan-400 outline-none"
                title="Porta SSL da LG TV (3001 para WSS, 3000 para WS)"
              />
            </div>
          </div>

          {/* Guide dropdown */}
          {showGuide && (
            <div className="p-3 rounded-xl bg-slate-950 border border-cyan-900/50 text-xs text-slate-300 flex flex-col gap-2 animate-in fade-in">
              <span className="font-bold text-cyan-400">Como descobrir o IP na sua TV LG:</span>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                <li>Na TV, aperte o botão de <strong>Configurações ⚙️</strong></li>
                <li>Vá em <strong>Rede</strong> (ou <em>Geral &gt; Rede</em>)</li>
                <li>Selecione <strong>Conexão Wi-Fi</strong> &gt; <strong>Configurações Avançadas de Wi-Fi</strong></li>
                <li>Veja o campo <strong>Endereço IP</strong> (ex: 192.168.1.X ou 10.0.0.X) e digite acima!</li>
              </ol>
            </div>
          )}
        </div>

        {/* SSL / WSS Helper Card for Vercel */}
        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Conexão Segura na Vercel (HTTPS / WSS)
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Como este app roda na web via HTTPS na Vercel, seu navegador no celular precisa autorizar o certificado interno da TV LG uma única vez:
          </p>
          <button
            type="button"
            onClick={handleOpenCertWindow}
            className="w-full h-10 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/50 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Abrir para Aceitar Certificado da TV</span>
          </button>
          <span className="text-[10px] text-slate-500">
            (Na página que abrir, clique em &quot;Avançado&quot; &gt; &quot;Continuar para {tvIp} (não seguro)&quot; e volte para cá).
          </span>
        </div>

        {/* App Preferences */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
          <span className="text-xs font-semibold text-white">Preferências do Controle</span>

          {/* Haptics */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Vibrate className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-xs font-medium text-slate-200 block">Vibração Tátil (Haptic)</span>
                <span className="text-[10px] text-slate-500">Vibra o celular ao tocar nos botões</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHaptics(!haptics)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                haptics ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  haptics ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-xs font-medium text-slate-200 block">Sons de Clique</span>
                <span className="text-[10px] text-slate-500">Som sintético de clique de controle</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSound(!sound)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                sound ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  sound ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save button */}
        <RemoteButton
          variant="primary"
          hapticType="success"
          soundType="enter"
          onPress={handleSave}
          enableHaptics={enableHaptics}
          enableSound={enableSound}
          className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm"
        >
          {savedSuccess ? (
            <>
              <Check className="w-5 h-5 text-white" />
              <span>Configurações Salvas!</span>
            </>
          ) : (
            <span>Salvar &amp; Conectar à TV</span>
          )}
        </RemoteButton>
      </div>
    </div>
  );
};
