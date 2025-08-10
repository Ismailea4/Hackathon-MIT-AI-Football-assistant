// Types for the AI Football Assistant
export interface FootballStats {
  possession: {
    home: number;
    away: number;
  };
  shots: {
    home: number;
    away: number;
  };
  passAccuracy: {
    home: number;
    away: number;
  };
  corners: {
    home: number;
    away: number;
  };
  fouls: {
    home: number;
    away: number;
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  audioUrl?: string;
}

export interface VideoData {
  file: File | null;
  url: string | null;
  duration: number;
  currentTime: number;
}

export interface Player {
  id: number;
  team: 'home' | 'away';
  x: number;
  y: number;
  number: number;
}

export interface TeamFormation {
  home: Player[];
  away: Player[];
}