import { TVApp } from './types';

export const POPULAR_APPS: TVApp[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    iconName: 'Film',
    color: '#E50914',
    bgGradient: 'from-red-600 to-red-800',
    appIdMap: {
      lg: 'netflix',
      samsung: '11101200001',
      roku: '12',
    },
  },
  {
    id: 'youtube',
    name: 'YouTube',
    iconName: 'PlaySquare',
    color: '#FF0000',
    bgGradient: 'from-red-500 to-red-700',
    appIdMap: {
      lg: 'youtube.leanback.v4',
      samsung: '111299001912',
      roku: '837',
    },
  },
  {
    id: 'prime',
    name: 'Prime Video',
    iconName: 'Tv',
    color: '#00A8E1',
    bgGradient: 'from-sky-500 to-blue-700',
    appIdMap: {
      lg: 'amazon',
      samsung: '3201512006785',
      roku: '13',
    },
  },
  {
    id: 'disney',
    name: 'Disney+',
    iconName: 'Sparkles',
    color: '#113CCF',
    bgGradient: 'from-blue-600 to-indigo-900',
    appIdMap: {
      lg: 'disney',
      samsung: '3201901019365',
      roku: '291097',
    },
  },
  {
    id: 'max',
    name: 'Max',
    iconName: 'Clapperboard',
    color: '#002BE7',
    bgGradient: 'from-blue-700 to-violet-900',
    appIdMap: {
      lg: 'max',
      samsung: '3201601007250',
      roku: '61322',
    },
  },
  {
    id: 'globoplay',
    name: 'Globoplay',
    iconName: 'Radio',
    color: '#FB0C06',
    bgGradient: 'from-orange-500 to-red-600',
    appIdMap: {
      lg: 'globoplay',
      samsung: '3201606009684',
      roku: '17281',
    },
  },
  {
    id: 'spotify',
    name: 'Spotify',
    iconName: 'Music',
    color: '#1DB954',
    bgGradient: 'from-emerald-500 to-green-700',
    appIdMap: {
      lg: 'spotify-beehive',
      samsung: '3201606009684',
      roku: '19977',
    },
  },
  {
    id: 'appletv',
    name: 'Apple TV',
    iconName: 'Apple',
    color: '#A2AAAD',
    bgGradient: 'from-neutral-700 to-neutral-900',
    appIdMap: {
      lg: 'com.apple.appletv',
      samsung: '3201807016597',
      roku: '551012',
    },
  },
  {
    id: 'browser',
    name: 'Navegador Web',
    iconName: 'Globe',
    color: '#06B6D4',
    bgGradient: 'from-cyan-600 to-teal-800',
    appIdMap: {
      lg: 'com.webos.app.browser',
    },
  },
  {
    id: 'livetv',
    name: 'TV Aberta / Canais',
    iconName: 'Tv2',
    color: '#8B5CF6',
    bgGradient: 'from-purple-600 to-indigo-800',
    appIdMap: {
      lg: 'com.webos.app.livetv',
    },
  },
];
