'use client';

import React from 'react';
import { POPULAR_APPS } from '@/lib/tvProtocols/apps';
import { RemoteButton } from './RemoteButton';
import {
  Film,
  PlaySquare,
  Tv,
  Sparkles,
  Clapperboard,
  Radio,
  Music,
  Globe,
  Tv2,
  LucideIcon,
} from 'lucide-react';

interface AppGridProps {
  onLaunchApp: (appId: string) => void;
  enableHaptics?: boolean;
  enableSound?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  Film,
  PlaySquare,
  Tv,
  Sparkles,
  Clapperboard,
  Radio,
  Music,
  Globe,
  Tv2,
};

export const AppGrid: React.FC<AppGridProps> = ({
  onLaunchApp,
  enableHaptics,
  enableSound,
}) => {
  return (
    <div className="w-full flex flex-col gap-2 px-2 py-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300">Aplicativos de Streaming</span>
        <span className="text-[10px] text-slate-500 font-mono">1 Toque p/ Abrir na TV</span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {POPULAR_APPS.slice(0, 10).map((app) => {
          const IconComponent = iconMap[app.iconName] || Tv;

          return (
            <RemoteButton
              key={app.id}
              variant="default"
              hapticType="medium"
              soundType="enter"
              onPress={() => onLaunchApp(app.appIdMap.lg)}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              className="h-16 rounded-2xl flex flex-col items-center justify-center gap-1.5 p-1 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800/80 group transition-all"
              title={`Abrir ${app.name} na TV`}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-active:scale-90"
                style={{ backgroundColor: `${app.color}25` }}
              >
                <IconComponent className="w-4 h-4" style={{ color: app.color }} />
              </div>
              <span className="text-[10px] font-medium text-slate-300 truncate max-w-[64px] text-center">
                {app.name}
              </span>
            </RemoteButton>
          );
        })}
      </div>
    </div>
  );
};
