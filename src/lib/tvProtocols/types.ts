export type TVBrand = 'lg_webos' | 'samsung_tizen' | 'roku' | 'android_tv';

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'pairing_prompt'
  | 'connected'
  | 'error';

export interface TVDevice {
  id: string;
  name: string;
  brand: TVBrand;
  ip: string;
  port?: number;
  mac?: string;
  clientKey?: string;
  isDefault?: boolean;
}

export type RemoteCommand =
  // Power & System
  | 'POWER'
  | 'POWER_OFF'
  | 'HOME'
  | 'BACK'
  | 'MENU'
  | 'EXIT'
  | 'INFO'
  | 'GUIDE'
  // Navigation D-Pad
  | 'UP'
  | 'DOWN'
  | 'LEFT'
  | 'RIGHT'
  | 'ENTER'
  // Volume & Audio
  | 'VOLUME_UP'
  | 'VOLUME_DOWN'
  | 'MUTE'
  // Channels
  | 'CHANNEL_UP'
  | 'CHANNEL_DOWN'
  | 'PREV_CHANNEL'
  // Numbers
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  // Media Playback
  | 'PLAY'
  | 'PAUSE'
  | 'PLAY_PAUSE'
  | 'STOP'
  | 'FAST_FORWARD'
  | 'REWIND'
  // Inputs / Sources
  | 'INPUT'
  | 'INPUT_HDMI1'
  | 'INPUT_HDMI2'
  | 'INPUT_HDMI3'
  | 'INPUT_TV'
  | 'INPUT_AV'
  // Color Buttons
  | 'RED'
  | 'GREEN'
  | 'YELLOW'
  | 'BLUE';

export interface TVApp {
  id: string;
  name: string;
  iconName: string;
  color: string;
  bgGradient: string;
  appIdMap: {
    lg: string;
    samsung?: string;
    roku?: string;
  };
}

export interface AppSettings {
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  theme: 'dark-oled' | 'midnight-blue' | 'graphite';
  activeDeviceId: string;
  devices: TVDevice[];
}
