import { lgClient } from './lgWebOS';
import { RemoteCommand, TVDevice } from './types';

class RemoteManager {
  private activeDevice: TVDevice | null = null;

  public setActiveDevice(device: TVDevice) {
    this.activeDevice = device;
  }

  public getActiveDevice(): TVDevice | null {
    return this.activeDevice;
  }

  public async connect(device: TVDevice): Promise<boolean> {
    this.activeDevice = device;
    if (device.brand === 'lg_webos') {
      return lgClient.connect(device);
    }
    // Fallback or future brands
    return lgClient.connect(device);
  }

  public disconnect() {
    if (this.activeDevice?.brand === 'lg_webos') {
      lgClient.disconnect();
    }
  }

  public sendCommand(cmd: RemoteCommand): boolean {
    if (!this.activeDevice) return false;

    if (this.activeDevice.brand === 'lg_webos') {
      return lgClient.sendCommand(cmd);
    }
    return false;
  }

  public launchApp(appId: string): boolean {
    if (!this.activeDevice) return false;
    if (this.activeDevice.brand === 'lg_webos') {
      return lgClient.launchApp(appId);
    }
    return false;
  }

  public sendText(text: string): boolean {
    if (!this.activeDevice) return false;
    if (this.activeDevice.brand === 'lg_webos') {
      return lgClient.sendText(text);
    }
    return false;
  }

  public sendPointerMove(dx: number, dy: number): boolean {
    if (!this.activeDevice) return false;
    if (this.activeDevice.brand === 'lg_webos') {
      return lgClient.sendPointerMove(dx, dy);
    }
    return false;
  }

  public sendPointerClick(): boolean {
    if (!this.activeDevice) return false;
    if (this.activeDevice.brand === 'lg_webos') {
      return lgClient.sendPointerClick();
    }
    return false;
  }

  public sendPointerScroll(dy: number): boolean {
    if (!this.activeDevice) return false;
    if (this.activeDevice.brand === 'lg_webos') {
      return lgClient.sendPointerScroll(dy);
    }
    return false;
  }
}

export const remoteManager = new RemoteManager();
