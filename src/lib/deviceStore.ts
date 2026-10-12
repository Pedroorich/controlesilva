import { AppSettings, TVDevice } from './tvProtocols/types';

const STORAGE_KEY = 'remote_tv_app_settings_v1';

export const DEFAULT_DEVICES: TVDevice[] = [
  {
    id: 'tv_lg_sala',
    name: 'Smart TV LG (Sala)',
    brand: 'lg_webos',
    ip: '192.168.1.100',
    port: 3001,
    isDefault: true,
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  hapticsEnabled: true,
  soundEnabled: true,
  theme: 'dark-oled',
  activeDeviceId: 'tv_lg_sala',
  devices: DEFAULT_DEVICES,
};

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      devices: parsed.devices && parsed.devices.length > 0 ? parsed.devices : DEFAULT_DEVICES,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function updateDevice(device: TVDevice): AppSettings {
  const current = loadSettings();
  const exists = current.devices.some((d) => d.id === device.id);
  const updatedDevices = exists
    ? current.devices.map((d) => (d.id === device.id ? device : d))
    : [...current.devices, device];

  const updatedSettings: AppSettings = {
    ...current,
    devices: updatedDevices,
    activeDeviceId: device.id,
  };
  saveSettings(updatedSettings);
  return updatedSettings;
}

export function removeDevice(deviceId: string): AppSettings {
  const current = loadSettings();
  const filtered = current.devices.filter((d) => d.id !== deviceId);
  const activeId =
    current.activeDeviceId === deviceId
      ? filtered[0]?.id || ''
      : current.activeDeviceId;

  const updatedSettings: AppSettings = {
    ...current,
    devices: filtered.length > 0 ? filtered : DEFAULT_DEVICES,
    activeDeviceId: activeId || DEFAULT_DEVICES[0].id,
  };
  saveSettings(updatedSettings);
  return updatedSettings;
}
