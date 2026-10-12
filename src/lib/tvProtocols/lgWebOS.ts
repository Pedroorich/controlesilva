import { ConnectionStatus, RemoteCommand, TVDevice } from './types';
import { updateDevice } from '../deviceStore';

type StatusListener = (status: ConnectionStatus, message?: string) => void;

class LGWebOSClient {
  private ws: WebSocket | null = null;
  private pointerWs: WebSocket | null = null;
  private reqCounter = 0;
  private currentDevice: TVDevice | null = null;
  private statusListeners: Set<StatusListener> = new Set();
  private status: ConnectionStatus = 'disconnected';
  private statusMessage = '';
  private isConnecting = false;

  public getStatus(): { status: ConnectionStatus; message: string } {
    return { status: this.status, message: this.statusMessage };
  }

  public subscribeStatus(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.status, this.statusMessage);
    return () => this.statusListeners.delete(listener);
  }

  private setStatus(status: ConnectionStatus, message = '') {
    this.status = status;
    this.statusMessage = message;
    this.statusListeners.forEach((l) => l(status, message));
  }

  public disconnect() {
    this.isConnecting = false;
    if (this.pointerWs) {
      try {
        this.pointerWs.close();
      } catch {}
      this.pointerWs = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }
    this.setStatus('disconnected', 'Desconectado da TV');
  }

  public async connect(device: TVDevice): Promise<boolean> {
    if (this.isConnecting) return false;
    this.disconnect();
    this.currentDevice = device;
    this.isConnecting = true;
    this.setStatus('connecting', `Conectando a ${device.name} (${device.ip})...`);

    // In modern browsers over HTTPS (like Vercel), wss:// on port 3001 is required.
    // Over HTTP (local network/IP), unencrypted ws:// on port 3000 avoids SSL certificate blocks.
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    let targetPort = device.port;
    if (isHttps) {
      targetPort = 3001;
    } else {
      // In HTTP mode, port 3000 is unencrypted and connects immediately without certificate issues
      targetPort = (!targetPort || targetPort === 3001) ? 3000 : targetPort;
    }

    const wsUrl = isHttps
      ? `wss://${device.ip}:${targetPort}`
      : `ws://${device.ip}:${targetPort}`;

    return new Promise((resolve) => {
      try {
        const socket = new WebSocket(wsUrl);
        this.ws = socket;

        const connectionTimeout = setTimeout(() => {
          if (this.status === 'connecting') {
            socket.close();
            this.isConnecting = false;
            this.setStatus(
              'error',
              `Tempo esgotado ao conectar a ${device.ip}:${targetPort}. Verifique se a TV está ligada na mesma rede Wi-Fi.`
            );
            resolve(false);
          }
        }, 7000);

        socket.onopen = () => {
          clearTimeout(connectionTimeout);
          this.sendRegistration(device);
        };

        socket.onmessage = (event) => {
          this.handleMessage(event.data);
          if (this.status === 'connected') {
            resolve(true);
          }
        };

        socket.onerror = () => {
          clearTimeout(connectionTimeout);
          this.isConnecting = false;
          const msg = isHttps
            ? `Falha ao conectar via WSS (${device.ip}:3001). O navegador precisa autorizar o certificado SSL da TV para liberar a conexão.`
            : `Erro ao conectar a ${device.ip}:${targetPort}. Verifique se a TV está ligada e na mesma rede Wi-Fi.`;
          this.setStatus('error', msg);
          resolve(false);
        };

        socket.onclose = () => {
          clearTimeout(connectionTimeout);
          this.isConnecting = false;
          if (this.status !== 'error') {
            this.setStatus('disconnected', 'Conexão encerrada.');
          }
        };
      } catch (err: unknown) {
        this.isConnecting = false;
        const errMsg = err instanceof Error ? err.message : 'Erro de rede desconhecido';
        this.setStatus('error', `Erro ao abrir WebSocket: ${errMsg}`);
        resolve(false);
      }
    });
  }

  private sendRegistration(device: TVDevice) {
    this.setStatus('pairing_prompt', 'Verifique a tela da sua TV e clique em "Permitir" se solicitado.');

    const handshakePayload = {
      id: `register_${++this.reqCounter}`,
      type: 'register',
      payload: {
        forcePairing: false,
        pairingType: 'PROMPT',
        'client-key': device.clientKey || undefined,
        manifest: {
          manifestVersion: 1,
          appVersion: '1.0',
          signed: {
            created: '20240101',
            appId: 'com.universal.remote.web',
            vendorId: 'com.universal',
            localizedAppNames: {
              '': 'Universal TV Remote',
              'pt-BR': 'Controle Remoto Universal',
            },
            localizedVendorNames: {
              '': 'Universal Web App',
            },
            permissions: [
              'LAUNCH',
              'LAUNCH_WEBAPP',
              'APP_TO_APP',
              'CLOSE',
              'TEST_OPEN',
              'TEST_PROTECTED',
              'CONTROL_AUDIO',
              'CONTROL_DISPLAY',
              'CONTROL_INPUT_JOYSTICK',
              'CONTROL_INPUT_MEDIA_RECORDING',
              'CONTROL_INPUT_MEDIA_PLAYBACK',
              'CONTROL_INPUT_TV',
              'READ_APP_STATUS',
              'READ_CURRENT_CHANNEL',
              'READ_INPUT_DEVICE_LIST',
              'READ_NETWORK_STATE',
              'READ_RUNNING_APPS',
              'READ_TV_CHANNEL_LIST',
              'WRITE_NOTIFICATION_TO_APP',
            ],
            serial: '2f93024s852379',
          },
          permissions: [
            'LAUNCH',
            'LAUNCH_WEBAPP',
            'APP_TO_APP',
            'CLOSE',
            'TEST_OPEN',
            'TEST_PROTECTED',
            'CONTROL_AUDIO',
            'CONTROL_DISPLAY',
            'CONTROL_INPUT_JOYSTICK',
            'CONTROL_INPUT_MEDIA_RECORDING',
            'CONTROL_INPUT_MEDIA_PLAYBACK',
            'CONTROL_INPUT_TV',
            'READ_APP_STATUS',
            'READ_CURRENT_CHANNEL',
            'READ_INPUT_DEVICE_LIST',
            'READ_NETWORK_STATE',
            'READ_RUNNING_APPS',
            'READ_TV_CHANNEL_LIST',
            'WRITE_NOTIFICATION_TO_APP',
          ],
        },
      },
    };

    this.sendJson(handshakePayload);
  }

  private handleMessage(dataStr: string) {
    try {
      const data = JSON.parse(dataStr);

      if (data.type === 'registered') {
        const clientKey = data.payload?.['client-key'];
        if (clientKey && this.currentDevice) {
          const updated = { ...this.currentDevice, clientKey };
          this.currentDevice = updated;
          updateDevice(updated);
        }
        this.setStatus('connected', 'Conectado à TV com sucesso!');
        // Initialize pointer socket for mouse trackpad and fast button input
        this.initPointerSocket();
      } else if (data.type === 'response') {
        if (data.payload?.pairingType === 'PROMPT') {
          this.setStatus('pairing_prompt', 'Olhe para a tela da TV e clique em "Permitir" usando o controle da TV.');
        }
        if (data.payload?.socketPath) {
          this.connectPointerSocket(data.payload.socketPath);
        }
      } else if (data.type === 'error') {
        this.setStatus('error', `Aviso da TV: ${data.error || 'Acesso não autorizado na tela da TV'}`);
      }
    } catch (e) {
      console.warn('Error parsing message from TV:', e);
    }
  }

  private initPointerSocket() {
    this.sendRequest('ssap://com.webos.service.networkinput/getPointerInputSocket');
  }

  private connectPointerSocket(socketPath: string) {
    try {
      const pWs = new WebSocket(socketPath);
      this.pointerWs = pWs;
      pWs.onclose = () => {
        this.pointerWs = null;
      };
      pWs.onerror = () => {
        this.pointerWs = null;
      };
    } catch {
      // Pointer socket optional fallback
    }
  }

  private sendJson(payload: unknown) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
      return true;
    }
    return false;
  }

  public sendRequest(uri: string, payload?: Record<string, unknown>) {
    const id = `req_${++this.reqCounter}`;
    return this.sendJson({
      id,
      type: 'request',
      uri,
      payload,
    });
  }

  public sendPointerButton(buttonName: string): boolean {
    if (this.pointerWs && this.pointerWs.readyState === WebSocket.OPEN) {
      this.pointerWs.send(`type:button\nname:${buttonName}\n\n`);
      return true;
    }
    return false;
  }

  public sendPointerMove(dx: number, dy: number): boolean {
    if (this.pointerWs && this.pointerWs.readyState === WebSocket.OPEN) {
      this.pointerWs.send(`type:move\ndx:${dx}\ndy:${dy}\ndown:0\n\n`);
      return true;
    }
    return false;
  }

  public sendPointerClick(): boolean {
    if (this.pointerWs && this.pointerWs.readyState === WebSocket.OPEN) {
      this.pointerWs.send('type:click\n\n');
      return true;
    }
    return false;
  }

  public sendPointerScroll(dy: number): boolean {
    if (this.pointerWs && this.pointerWs.readyState === WebSocket.OPEN) {
      this.pointerWs.send(`type:scroll\ndx:0\ndy:${dy}\n\n`);
      return true;
    }
    return false;
  }

  // High-level command dispatcher
  public sendCommand(cmd: RemoteCommand): boolean {
    // If not connected, we still report false
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    switch (cmd) {
      // Volume
      case 'VOLUME_UP':
        return this.sendRequest('ssap://audio/volumeUp');
      case 'VOLUME_DOWN':
        return this.sendRequest('ssap://audio/volumeDown');
      case 'MUTE':
        return this.sendRequest('ssap://audio/setMute', { mute: true });

      // Channels
      case 'CHANNEL_UP':
        return this.sendRequest('ssap://tv/channelUp');
      case 'CHANNEL_DOWN':
        return this.sendRequest('ssap://tv/channelDown');

      // Media controls
      case 'PLAY':
        return this.sendRequest('ssap://media.controls/play');
      case 'PAUSE':
        return this.sendRequest('ssap://media.controls/pause');
      case 'PLAY_PAUSE':
        return this.sendRequest('ssap://media.controls/play');
      case 'STOP':
        return this.sendRequest('ssap://media.controls/stop');
      case 'FAST_FORWARD':
        return this.sendRequest('ssap://media.controls/fastForward');
      case 'REWIND':
        return this.sendRequest('ssap://media.controls/rewind');

      // Power
      case 'POWER':
      case 'POWER_OFF':
        return this.sendRequest('ssap://system/turnOff');

      // System menus & Home
      case 'HOME':
        if (this.sendPointerButton('HOME')) return true;
        return this.sendRequest('ssap://system.launcher/open');
      case 'BACK':
        if (this.sendPointerButton('BACK')) return true;
        return this.sendRequest('ssap://media.viewer/close');
      case 'MENU':
        if (this.sendPointerButton('MENU')) return true;
        return this.sendRequest('ssap://com.webos.applicationManager/openSettings');
      case 'EXIT':
        if (this.sendPointerButton('EXIT')) return true;
        return this.sendRequest('ssap://media.viewer/close');
      case 'INFO':
        if (this.sendPointerButton('INFO')) return true;
        return this.sendRequest('ssap://tv/getCurrentChannel');

      // D-Pad Navigation
      case 'UP':
        if (this.sendPointerButton('UP')) return true;
        return this.sendRequest('ssap://com.webos.service.networkinput/sendSpecialKey', { key: 'UP' });
      case 'DOWN':
        if (this.sendPointerButton('DOWN')) return true;
        return this.sendRequest('ssap://com.webos.service.networkinput/sendSpecialKey', { key: 'DOWN' });
      case 'LEFT':
        if (this.sendPointerButton('LEFT')) return true;
        return this.sendRequest('ssap://com.webos.service.networkinput/sendSpecialKey', { key: 'LEFT' });
      case 'RIGHT':
        if (this.sendPointerButton('RIGHT')) return true;
        return this.sendRequest('ssap://com.webos.service.networkinput/sendSpecialKey', { key: 'RIGHT' });
      case 'ENTER':
        if (this.sendPointerButton('ENTER')) return true;
        return this.sendRequest('ssap://com.webos.service.networkinput/sendSpecialKey', { key: 'ENTER' });

      // Numbers
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        if (this.sendPointerButton(cmd)) return true;
        return this.sendRequest('ssap://tv/openChannel', { channelNumber: cmd });

      // Color buttons
      case 'RED':
        return this.sendPointerButton('RED');
      case 'GREEN':
        return this.sendPointerButton('GREEN');
      case 'YELLOW':
        return this.sendPointerButton('YELLOW');
      case 'BLUE':
        return this.sendPointerButton('BLUE');

      // Inputs
      case 'INPUT':
        return this.sendRequest('ssap://tv/switchInput');
      case 'INPUT_HDMI1':
        return this.launchApp('com.webos.app.hdmi1');
      case 'INPUT_HDMI2':
        return this.launchApp('com.webos.app.hdmi2');
      case 'INPUT_HDMI3':
        return this.launchApp('com.webos.app.hdmi3');
      case 'INPUT_TV':
        return this.launchApp('com.webos.app.livetv');
      case 'INPUT_AV':
        return this.launchApp('com.webos.app.av');

      default:
        return false;
    }
  }

  public launchApp(appId: string): boolean {
    return this.sendRequest('ssap://system.launcher/launch', { id: appId });
  }

  public sendText(text: string): boolean {
    // Send text into active TV search/input field
    const sentIme = this.sendRequest('ssap://com.webos.service.ime/insertText', {
      text,
      replace: 0,
    });
    return sentIme;
  }
}

// Global singleton instance
export const lgClient = new LGWebOSClient();
