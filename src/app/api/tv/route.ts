import { NextRequest, NextResponse } from 'next/server';

// Server-side LG webOS bridge for local network control
// When running locally on the PC, Node.js can connect directly to the TV without any browser/iOS WebKit restrictions.

let serverWs: any = null;
let currentClientKey: string | null = null;
let lastStatus = 'disconnected';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: lastStatus,
    clientKey: currentClientKey,
    info: 'LG webOS local server bridge',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ip, command, clientKey } = body;
    const targetIp = ip || '192.168.1.196';

    if (action === 'connect') {
      if (serverWs) {
        try {
          serverWs.close();
        } catch {}
      }

      // In Node.js 20+, global WebSocket is available
      return new Promise<NextResponse>((resolve) => {
        try {
          const ws = new WebSocket(`ws://${targetIp}:3000`);
          serverWs = ws;
          lastStatus = 'connecting';

          const timeout = setTimeout(() => {
            lastStatus = 'error';
            resolve(
              NextResponse.json({
                success: false,
                error: 'Timeout connecting to TV',
              })
            );
          }, 5000);

          ws.onopen = () => {
            clearTimeout(timeout);
            lastStatus = 'pairing_prompt';
            // Send registration handshake
            const handshake = {
              id: 'register_server_bridge',
              type: 'register',
              payload: {
                forcePairing: false,
                pairingType: 'PROMPT',
                'client-key': clientKey || currentClientKey || undefined,
                manifest: {
                  manifestVersion: 1,
                  appVersion: '1.0',
                  signed: {
                    created: '20240101',
                    appId: 'com.universal.remote.web',
                    vendorId: 'com.universal',
                    localizedAppNames: { '': 'Controle Universal' },
                    localizedVendorNames: { '': 'Universal Web' },
                    permissions: ['LAUNCH', 'CONTROL_AUDIO', 'CONTROL_INPUT_TV'],
                    serial: '2f93024s852379',
                  },
                  permissions: ['LAUNCH', 'CONTROL_AUDIO', 'CONTROL_INPUT_TV'],
                },
              },
            };
            ws.send(JSON.stringify(handshake));
            resolve(
              NextResponse.json({
                success: true,
                status: 'pairing_prompt',
                message: 'Verifique a tela da TV e clique em Permitir',
              })
            );
          };

          ws.onmessage = (event: any) => {
            try {
              const data = JSON.parse(event.data);
              if (data.type === 'registered') {
                lastStatus = 'connected';
                if (data.payload?.['client-key']) {
                  currentClientKey = data.payload['client-key'];
                }
              }
            } catch {}
          };

          ws.onerror = (err: any) => {
            clearTimeout(timeout);
            lastStatus = 'error';
            resolve(
              NextResponse.json({
                success: false,
                error: 'Erro de conexão com a TV',
              })
            );
          };
        } catch (e: any) {
          resolve(
            NextResponse.json({
              success: false,
              error: e.message || 'Erro desconhecido',
            })
          );
        }
      });
    }

    if (action === 'command' && command) {
      if (!serverWs || serverWs.readyState !== 1) {
        return NextResponse.json({
          success: false,
          error: 'TV não conectada no servidor local',
        });
      }

      // Map basic commands to ssap URIs
      let uri = '';
      if (command === 'VOLUME_UP') uri = 'ssap://audio/volumeUp';
      else if (command === 'VOLUME_DOWN') uri = 'ssap://audio/volumeDown';
      else if (command === 'MUTE') uri = 'ssap://audio/setMute';
      else if (command === 'POWER') uri = 'ssap://system/turnOff';
      else if (command === 'HOME') uri = 'ssap://system.launcher/open';
      else if (command === 'BACK') uri = 'ssap://media.viewer/close';

      if (uri) {
        serverWs.send(
          JSON.stringify({
            id: `cmd_${Date.now()}`,
            type: 'request',
            uri,
          })
        );
        return NextResponse.json({ success: true, command });
      }

      return NextResponse.json({ success: false, error: 'Comando não mapeado' });
    }

    return NextResponse.json({ success: false, error: 'Ação inválida' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro no servidor' },
      { status: 500 }
    );
  }
}
