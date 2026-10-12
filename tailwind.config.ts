import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090d16",
        surface: "#131b2e",
        surfaceLight: "#1c2742",
        remote: {
          dark: "#0f172a",
          card: "#1e293b",
          border: "#334155",
          accent: "#3b82f6",
          danger: "#ef4444",
          ok: "#10b981",
        }
      },
      boxShadow: {
        'remote-btn': '0 4px 6px -1px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'remote-btn-active': '0 1px 2px 0 rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.6)',
        'dpad-ring': '0 10px 25px -5px rgba(0, 0, 0, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.15)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.35)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
export default config;
