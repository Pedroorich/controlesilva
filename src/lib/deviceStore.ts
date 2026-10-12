import { AppSettings, TVDevice } from './tvProtocols/types';

export const STORAGE_KEY = 'remote_tv_app_settings_v1';
export const IP_STORAGE_KEY = 'remote_tv_saved_ip';

export const DEFAULT_DEVICES: TVDevice[] = [
  {
    id: 'tv_lg_sala',
    name: 'Smart TV LG',
    brand: 'lg_webos',
    ip: '192.168.1.196',
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

export function getSavedIp(): string {
  if (typeof window === 'undefined') return '192.168.1.196';
  try {
    const raw = localStorage.getItem(IP_STORAGE_KEY);
    if (raw && raw.trim() && raw.trim() !== '192.168.1.100') {
      return raw.trim();
    }
  } catch {}
  return '192.168.1.196';
}

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const savedIp = getSavedIp();
    const raw = localStorage.getItem(STORAGE_KEY);
    let parsed: Partial<AppSettings> = {};

    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        console.warn('Error parsing saved settings, falling back to defaults:', e);
      }
    }

    let devices: TVDevice[] =
      parsed.devices && parsed.devices.length > 0 ? parsed.devices : DEFAULT_DEVICES;

    // Migrate any instance of the old default 192.168.1.100 or sync with savedIp
    devices = devices.map((d) => {
      let currentIp = d.ip;
      if (!currentIp || currentIp === '192.168.1.100') {
        currentIp = savedIp;
      }
      return {
        ...d,
        ip: currentIp,
        port: d.port || 3001,
      };
    });

    // Make sure we have at least one device with the right IP
    if (!devices.some((d) => d.id === 'tv_lg_sala')) {
      devices = [
        {
          id: 'tv_lg_sala',
          name: 'Smart TV LG',
          brand: 'lg_webos',
          ip: savedIp,
          port: 3001,
          isDefault: true,
        },
        ...devices,
      ];
    }

    const activeId = parsed.activeDeviceId && devices.some((d) => d.id === parsed.activeDeviceId)
      ? parsed.activeDeviceId
      : devices[0].id;

    const settings: AppSettings = {
      ...DEFAULT_SETTINGS,
      ...parsed,
      devices,
      activeDeviceId: activeId,
    };

    return settings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    const active =
      settings.devices.find((d) => d.id === settings.activeDeviceId) || settings.devices[0];
    if (active?.ip) {
      localStorage.setItem(IP_STORAGE_KEY, active.ip.trim());
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function updateDevice(device: TVDevice): AppSettings {
  if (device.ip) {
    try {
      localStorage.setItem(IP_STORAGE_KEY, device.ip.trim());
    } catch {}
  }

  const current = loadSettings();
  const exists = current.devices.some((d) => d.id === device.id);
  const updatedDevices = exists
    ? current.devices.map((d) => (d.id === device.id ? device : d))
    : [device, ...current.devices];

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
    current.activeDeviceId === deviceId ? filtered[0]?.id || '' : current.activeDeviceId;

  const updatedSettings: AppSettings = {
    ...current,
    devices: filtered.length > 0 ? filtered : DEFAULT_DEVICES,
    activeDeviceId: activeId || DEFAULT_DEVICES[0].id,
  };
  saveSettings(updatedSettings);
  return updatedSettings;
}
