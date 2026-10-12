'use client';

import React from 'react';
import { triggerHaptic } from '@/lib/haptics';
import { playTactileClick } from '@/lib/soundEffects';

interface RemoteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onPress?: () => void;
  hapticType?: 'light' | 'medium' | 'heavy' | 'success';
  soundType?: 'click' | 'enter' | 'power' | 'toggle';
  variant?: 'default' | 'primary' | 'danger' | 'ghost' | 'rocker' | 'dpad';
  children: React.ReactNode;
  className?: string;
  enableHaptics?: boolean;
  enableSound?: boolean;
}

export const RemoteButton: React.FC<RemoteButtonProps> = ({
  onPress,
  onClick,
  hapticType = 'light',
  soundType = 'click',
  variant = 'default',
  children,
  className = '',
  enableHaptics = true,
  enableSound = true,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enableHaptics) {
      triggerHaptic(hapticType);
    }
    if (enableSound) {
      playTactileClick(soundType);
    }
    if (onPress) {
      onPress();
    }
    if (onClick) {
      onClick(e);
    }
  };

  const baseStyles =
    'relative select-none transition-all duration-150 active:scale-95 focus:outline-none flex items-center justify-center font-medium touch-manipulation disabled:opacity-50 disabled:pointer-events-none';

  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles =
        'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-remote-btn rounded-2xl active:shadow-remote-btn-active';
      break;
    case 'danger':
      variantStyles =
        'bg-red-600/90 hover:bg-red-500 active:bg-red-700 text-white shadow-remote-btn rounded-2xl active:shadow-remote-btn-active hover:shadow-glow-red';
      break;
    case 'ghost':
      variantStyles =
        'bg-slate-800/60 hover:bg-slate-800 active:bg-slate-900 text-slate-300 hover:text-white rounded-xl border border-slate-700/50';
      break;
    case 'rocker':
      variantStyles =
        'bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-200 active:from-slate-900 active:to-black border border-slate-700/60 shadow-remote-btn active:shadow-remote-btn-active';
      break;
    case 'dpad':
      variantStyles =
        'bg-slate-800/90 hover:bg-slate-700 active:bg-slate-900 text-slate-200 active:text-white active:shadow-inner';
      break;
    default:
      variantStyles =
        'bg-slate-800/80 hover:bg-slate-700/80 active:bg-slate-900 text-slate-200 active:text-white rounded-2xl border border-slate-700/50 shadow-remote-btn active:shadow-remote-btn-active';
      break;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
