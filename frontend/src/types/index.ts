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
  formations?: {
    home: string;
    away: string;
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  audioUrl?: string;
  insights?: string[];
}

export interface VideoData {
  file: File | null;
  url: string | null;
  duration: number;
  currentTime: number;
  videoId?: string;
}

export interface Player {
  id: number;
  name?: string;
  team: 'home' | 'away';
  x: number;
  y: number;
  number: number;
  position?: string;
  stats?: PlayerStats;
}

export interface PlayerStats {
  passes: number;
  shots: number;
  tackles: number;
  distance: number;
  heatmap?: HeatmapData;
}

export interface HeatmapData {
  positions: Array<{ x: number; y: number; weight: number }>;
}

export interface TeamFormation {
  home: Player[];
  away: Player[];
  timestamp?: number;
}

export interface AnalysisRequest {
  videoFile?: File;
  query: string;
  timestamp?: number;
}

export interface AnalysisResponse {
  text: string;
  audioUrl?: string;
  stats?: FootballStats;
  formations?: {
    home: string;
    away: string;
  };
  insights?: string[];
}

export interface ApiError {
  error: string;
  status: number;
  message?: string;
}