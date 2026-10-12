# 📱 Controle Remoto Universal Smart TV LG (webOS) - Mobile Web & PWA

Um aplicativo moderno, rápido e completo de **Controle Remoto Universal para Smart TV LG (webOS)** projetado especificamente para ser utilizado no **celular** e hospedado gratuitamente na **Vercel**.

Criado para substituir 100% o controle físico quebrado, incluindo recursos inteligentes que superam os controles tradicionais.

---

## ✨ Funcionalidades Incluídas

### 1. Funções Tradicionais do Controle Remoto:
* **Ligar / Desligar (Power):** Botão proeminente de desligar com feedback tátil.
* **Navegação Central (D-Pad Ergonômico):**
  * Setas (Cima, Baixo, Esquerda, Direita).
  * Botão Central **OK / Enter** destacado em azul/ciano.
  * Botões de apoio: **Voltar (Back)**, **Início (Home / Smart Hub)**, **Sair (Exit)** e **Info / Guia**.
* **Controle de Volume e Canais (Estilo Gangorra/Rocker):**
  * Coluna de Volume (+, VOL, -).
  * Botão **Mudo (Mute)** com destaque de status ativo.
  * Botão **Canal Anterior (Flashback)**.
  * Coluna de Canal (+, CANAL, -).
* **Botões Coloridos Interativos:** Vermelho, Verde, Amarelo e Azul para menus de canais e apps.
* **Controles de Mídia:** Retroceder (<<), Play, Pause, Stop e Avançar (>>).
* **Seleção de Entradas (Source):** Menu retrátil com HDMI 1, HDMI 2, HDMI 3, TV e AV.

### 2. Recursos Inteligentes e Extras Aprovados:
* 🖱️ **Touchpad / Mouse Virtual:** Área sensível ao toque para mover o cursor na TV (estilo Apple TV e LG Magic Remote), toque rápido para clique e rolagem.
* ⌨️ **Teclado Virtual no Celular:** Digite buscas, senhas e títulos no teclado do seu celular e envie a frase inteira para a TV com 1 toque, sem precisar digitar letra por letra.
* 🎙️ **Comando por Voz (Ditado):** Microfone integrado no app para ditar pesquisas ou falar comandos automáticos (*"Abrir Netflix"*, *"Aumentar volume"*, *"Mudo"*, etc.).
* 🔢 **Teclado Numérico (0 a 9):** Gaveta numérica para digitar o número exato do canal da TV.
* ⚡ **Lançador Rápido de Streaming:** Botões dedicados com 1 toque para abrir direto na TV:
  * Netflix, YouTube, Prime Video, Disney+, Max, Globoplay, Spotify, Apple TV, Navegador Web e TV Aberta.
* 📳 **Feedback Háptico (Vibração Tátil):** O celular vibra suavemente ao tocar nos botões (`navigator.vibrate`), transmitindo a sensação de um controle real.
* 🔊 **Sons de Clique Táteis:** Síntese de áudio leve via Web Audio API.
* ⚙️ **Gerenciador de TV & IP:** Permite configurar o IP da TV, porta e salvar o dispositivo.

---

## 🚀 Como Subir na Vercel

1. **Envie este projeto para o seu GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: controle remoto universal LG"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/controle-tv.git
   git push -u origin main
   ```

2. **Acesse a [Vercel](https://vercel.com):**
   * Clique em **"Add New..."** > **"Project"**.
   * Importe o repositório `controle-tv`.
   * Clique em **"Deploy"** (a Vercel detecta Next.js automaticamente).
   * Em menos de 1 minuto, seu link estará pronto (ex: `https://seu-controle.vercel.app`).

---

## 📲 Como Usar no Celular (Instalação PWA)

1. No seu celular (conectado no **mesmo Wi-Fi da TV**), abra o link gerado pela Vercel no **Safari (iPhone)** ou **Chrome (Android)**.
2. **Adicione à Tela de Início:**
   * **No iPhone (Safari):** Toque no botão de Compartilhar (ícone com quadrado e seta para cima) > toque em **"Adicionar à Tela de Início"**.
   * **No Android (Chrome):** Toque nos 3 pontinhos no topo > toque em **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.
3. Abra o app pelo ícone criado na tela inicial: ele abrirá em **tela cheia**, sem barra de navegação, exatamente como um aplicativo nativo!

---

## 🔗 Conectando com a sua Smart TV LG

1. **Pegue o IP da sua TV LG:**
   * No menu da TV (usando os botões físicos da TV ou se puder acessar o menu):
   * Vá em **Configurações ⚙️** > **Rede** (ou *Geral > Rede*).
   * Selecione **Conexão Wi-Fi** > **Configurações Avançadas de Wi-Fi**.
   * Veja o número do **Endereço IP** (exemplo: `192.168.1.15`).
2. **No aplicativo no celular:**
   * Toque no ícone de **Configurações ⚙️** no topo do app.
   * Digite o IP da sua TV no campo correspondente e toque em **"Salvar & Conectar"**.
3. **Primeira Conexão (Pareamento na TV):**
   * Uma mensagem aparecerá na tela da sua TV LG: *"Permitir conexão de Universal Remote?"*.
   * Pressione **"Sim" / "Permitir"** na TV.
   * O aplicativo salvará a chave de pareamento e a partir de então conectará instantaneamente!

### 💡 Dica para Navegadores Web (HTTPS / Vercel):
Como a Vercel usa HTTPS (`https://`), a TV LG usa conexão segura WSS na porta `3001` com certificado interno. 
No modal de Configurações ⚙️ do app, há um botão: **"Abrir para Aceitar Certificado da TV"**. 
Toque nele uma única vez para autorizar a conexão no navegador do celular caso necessário.
