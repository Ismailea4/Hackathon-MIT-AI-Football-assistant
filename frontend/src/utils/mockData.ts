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
  home: { name: 'Team A', color: '#2563EB' },
  away: { name: 'Team B', color: '#DC2626' }
};

// Tactical analysis based on stats
export const generateAnalysis = (stats: FootballStats): string[] => {
  const analysis: string[] = [];
  
  // Possession analysis
  if (stats.possession.home > 60) {
    analysis.push("Team A is dominating possession, controlling the game's tempo");
  } else if (stats.possession.away > 60) {
    analysis.push("Team B is controlling possession, dictating the pace");
  } else {
    analysis.push("Possession is evenly contested between both teams");
  }

  // Shot efficiency analysis
  const homeEfficiency = (stats.shots.home / (stats.possession.home / 100)).toFixed(2);
  const awayEfficiency = (stats.shots.away / (stats.possession.away / 100)).toFixed(2);
  if (Number(homeEfficiency) > Number(awayEfficiency)) {
    analysis.push("Team A is creating more chances relative to their possession");
  } else if (Number(awayEfficiency) > Number(homeEfficiency)) {
    analysis.push("Team B is showing clinical efficiency with their chances");
  }

  // Pass accuracy insights
  if (stats.passAccuracy.home > 85) {
    analysis.push("Team A's high passing accuracy indicates excellent build-up play");
  }
  if (stats.passAccuracy.away > 85) {
    analysis.push("Team B is displaying impressive passing precision");
  }

  // Set piece potential
  if (stats.corners.home > stats.corners.away + 3) {
    analysis.push("Team A is creating pressure through set-pieces");
  } else if (stats.corners.away > stats.corners.home + 3) {
    analysis.push("Team B is threatening from set-piece situations");
  }

  // Game intensity
  const totalFouls = stats.fouls.home + stats.fouls.away;
  if (totalFouls > 20) {
    analysis.push("High-intensity contest with frequent tactical fouls");
  } else if (totalFouls < 10) {
    analysis.push("Clean, tactical game with minimal disruptions");
  }

  return analysis;
};