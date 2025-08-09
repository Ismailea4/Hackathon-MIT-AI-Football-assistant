import { FootballStats, ChatMessage } from '../types';

// Mock football statistics data
export const mockStats: FootballStats = {
  possession: { home: 58, away: 42 },
  shots: { home: 12, away: 8 },
  passAccuracy: { home: 87, away: 83 },
  corners: { home: 6, away: 4 },
  fouls: { home: 11, away: 14 }
};

// Mock chat messages
export const mockMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Hello! I can analyze football tactics and strategies. Upload a match clip to get started.',
    isUser: false,
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    text: 'What formation is the home team playing?',
    isUser: true,
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: '3',
    text: 'Based on the video analysis, the home team appears to be using a 4-3-3 formation with high pressing tactics. The wingers are staying wide to create width in attack.',
    isUser: false,
    timestamp: new Date(Date.now() - 180000)
  }
];

// Mock team data
export const mockTeams = {
  home: { name: 'Arsenal', color: '#DC2626' },
  away: { name: 'Chelsea', color: '#2563EB' }
};