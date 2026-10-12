'use client';

import React, { useState, useEffect } from 'react';
import { ConnectionStatus, TVDevice } from '@/lib/tvProtocols/types';
import {
  AlertCircle,
  ShieldAlert,
  ExternalLink,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Tv,
  CheckCircle2,
  Settings,
  Save,
  Check,
} from 'lucide-react';

interface ConnectionBannerProps {
  status: ConnectionStatus;
  statusMessage: string;
  device: TVDevice;
  onReconnect: () => void;
  onOpenSettings: () => void;
  onUpdateIp: (newIp: string) => void;
}

export const ConnectionBanner: React.FC<ConnectionBannerProps> = ({
  status,
  statusMessage,
  device,
  onReconnect,
  onOpenSettings,
  onUpdateIp,
}) => {
  const [showTvMenuGuide, setShowTvMenuGuide] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [customIp, setCustomIp] = useState(device.ip || '192.168.1.196');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Keep input in sync with device.ip whenever device updates
  useEffect(() => {
    if (device.ip) {
      setCustomIp(device.ip);
    }
  }, [device.ip]);

  const handleSaveIp = () => {
    const clean = customIp.trim();
    if (!clean) return;
    onUpdateIp(clean);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRetry = () => {
    setIsRetrying(true);
    // Make sure latest IP from input is applied before retry
    if (customIp.trim() && customIp.trim() !== device.ip) {
      onUpdateIp(customIp.trim());
    } else {
      onReconnect();
    }
    setTimeout(() => setIsRetrying(false), 2000);
  };

  // If already connected, do not show banner
  if (status === 'connected') {
    return null;
  }

  // Pairing prompt is waiting for user to click "Allow" on the TV screen
  if (status === 'pairing_prompt') {
    return (
      <div className="w-full px-4 pt-3">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-600/30 to-amber-700/20 border-2 border-amber-500/70 shadow-lg shadow-amber-500/10 flex items-start gap-3 animate-pulse">
          <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 flex flex-col gap-1.5">
            <h4 className="text-sm font-bold text-amber-200">
              🔔 Olhe para a tela da TV agora!
            </h4>
            <p className="text-xs text-amber-100/90 leading-relaxed">
              Uma mensagem apareceu no canto da tela da sua TV LG pedindo autorização para conectar o controle.
            </p>
            <div className="mt-1 p-2.5 rounded-xl bg-amber-950/70 border border-amber-800/70 text-xs font-semibold text-amber-300">
              👉 Clique em &quot;Permitir&quot; ou &quot;Sim&quot; na TV usando o controle ou botões do aparelho.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Connecting state
  if (status === 'connecting') {
    return (
      <div className="w-full px-4 pt-3">
        <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/60 flex items-center gap-3 text-xs text-blue-200">
          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
          <div className="flex-1">
            <span className="font-semibold block">Conectando a {customIp || device.ip}...</span>
            <span className="text-[11px] text-blue-300/80">Aguardando resposta da Smart TV LG...</span>
          </div>
        </div>
      </div>
    );
  }

  // Disconnected or Error state
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const targetIp = customIp.trim() || device.ip || '192.168.1.196';
  const certUrl = `https://${targetIp}:3001`;

  return (
    <div className="w-full px-4 pt-3 flex flex-col gap-3">
      <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-900/60 shadow-xl shadow-rose-950/20 flex flex-col gap-3.5">
        {/* Title */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Assistente de Conexão LG</h3>
              <p className="text-[11px] text-rose-300">
                Porta Segura: <span className="font-mono font-bold text-white">3001</span> (Padrão LG webOS)
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            type="button"
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            title="Mais configurações"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Mais Opções</span>
          </button>
        </div>

        {/* Quick IP Input & Save */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-slate-300">
              Endereço IP da sua TV LG:
            </label>
            {savedSuccess && (
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3 h-3" />
                IP Salvo com sucesso!
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customIp}
              onChange={(e) => setCustomIp(e.target.value)}
              placeholder="Ex: 192.168.1.196"
              className="flex-1 h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 outline-none"
            />
            <button
              type="button"
              onClick={handleSaveIp}
              className="h-10 px-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-cyan-900/30 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar IP</span>
            </button>
          </div>
          <span className="text-[10px] text-slate-400">
            O IP fica salvo permanentemente no seu aparelho e não se perde ao fechar o app.
          </span>
        </div>

        {/* Clear explanation of 3001 and WSS */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed space-y-1">
          <p>
            💡 <strong className="text-cyan-400">O que é o 3001?</strong> É o número da porta de rede interna da LG. <strong>Você NÃO precisa procurar esse número na sua TV!</strong> Ele já vem fixo de fábrica no sistema webOS.
          </p>
          {isHttps && (
            <p>
              🔒 <strong className="text-amber-400">Por que falhou no WSS?</strong> Como o app roda em site seguro (HTTPS), os navegadores bloqueiam a TV até você autorizar o certificado interno da LG uma única vez.
            </p>
          )}
        </div>

        {/* Action Steps */}
        <div className="flex flex-col gap-2.5">
          {/* Step 1: Open certificate window */}
          {isHttps && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-slate-300">
                1º Passo: Liberar o certificado no navegador
              </span>
              <a
                href={certUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] border border-cyan-400/50 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-900/30"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Toque Aqui para Desbloquear o IP {targetIp}</span>
              </a>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[10px] text-slate-400 space-y-1">
                <p className="font-semibold text-cyan-300">Na página que abrir:</p>
                <p>• O navegador vai avisar: <em>&quot;Sua conexão não é privada&quot;</em> ou <em>&quot;Aviso de segurança&quot;</em>.</p>
                <p>• Toque em <strong>&quot;Avançado&quot;</strong> e depois em <strong>&quot;Ir para {targetIp} (não seguro)&quot;</strong> ou <strong>&quot;Continuar&quot;</strong>.</p>
                <p>• Uma página vazia vai carregar. Feche aquela aba e volte para cá!</p>
              </div>
            </div>
          )}

          {/* Step 2: Retry connection */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-slate-300">
              {isHttps ? '2º Passo: Conectar à TV' : 'Conectar agora à TV'}
            </span>
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              type="button"
              className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] border border-emerald-400/50 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-900/30"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Conectando...' : `Conectar à TV (${targetIp}) Agora`}</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              Assim que conectar, a TV vai exibir a mensagem de pareamento na tela. Basta clicar em <strong>&quot;Permitir&quot;</strong>!
            </p>
          </div>
        </div>

        {/* Direct Local Network Alternative & Chrome Guide */}
        <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-[11px] text-slate-300 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-cyan-300">
            <span>🚀 Alternativa 100% Direta (Sem Bloqueios do Chrome):</span>
          </div>
          <p className="leading-relaxed">
            Se o Google Chrome continuar bloqueando a conexão WSS no link da Vercel, você tem duas opções simples que funcionam de primeira:
          </p>
          <div className="space-y-1.5 pl-1 border-l-2 border-cyan-500/50">
            <p>
              <strong>Opção A (Servidor Local no PC):</strong> Abra no celular o endereço:
              <br />
              <code className="text-cyan-300 font-mono text-xs bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 select-all">http://192.168.1.44:3000</code>
              <br />
              <span className="text-[10px] text-slate-400">
                (Como é conexão direta na rede Wi-Fi, não exige certificado e conecta instantaneamente!).
              </span>
            </p>
            <p className="pt-1">
              <strong>Opção B (Outro navegador no celular):</strong> Abra o link da Vercel no <strong>Samsung Internet</strong> ou <strong>Firefox</strong>, que não possuem a trava de rede local do Chrome.
            </p>
            <p className="pt-1">
              <strong>Opção C (Desativar a trava no Chrome):</strong> No Chrome do celular, digite <code className="text-cyan-300 font-mono text-[10px]">chrome://flags</code>, procure por <code className="text-cyan-300 font-mono text-[10px]">Local Network Access</code> e mude para <strong>Disabled</strong>.
            </p>
          </div>
        </div>

        {/* Collapsible TV Menu Guide */}
        <div className="border-t border-slate-800 pt-2.5">
          <button
            onClick={() => setShowTvMenuGuide(!showTvMenuGuide)}
            type="button"
            className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 transition-colors py-1"
          >
            <span className="flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-cyan-400" />
              <span>A TV ainda não conectou? Confira este menu na TV</span>
            </span>
            {showTvMenuGuide ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showTvMenuGuide && (
            <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-2 animate-in fade-in">
              <p className="font-semibold text-cyan-400">
                Ativar &quot;LG Connect Apps&quot; nas configurações da TV LG:
              </p>
              <p>
                Algumas TVs LG vêm com o controle por Wi-Fi desativado de fábrica. Para liberar:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                <li>
                  No controle da TV, aperte o botão de <strong>Configurações ⚙️</strong>.
                </li>
                <li>
                  <strong>Em TVs LG webOS antigas (2016-2020):</strong> Vá em <strong>Rede</strong> &gt; <strong>LG Connect Apps</strong> e marque como <strong>LIGADO</strong>.
                </li>
                <li>
                  <strong>Em TVs LG webOS recentes (2021-2024):</strong> Vá em <strong>Geral</strong> &gt; <strong>Dispositivos</strong> &gt; <strong>Dispositivos Externos</strong> &gt; <strong>Conectar TV a Smartphones</strong> (ou <em>Ligar TV via Wi-Fi</em>) e deixe <strong>ATIVADO</strong>.
                </li>
                <li>
                  Certifique-se de que o celular e a TV estão conectados na <strong>mesma rede Wi-Fi</strong>.
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
