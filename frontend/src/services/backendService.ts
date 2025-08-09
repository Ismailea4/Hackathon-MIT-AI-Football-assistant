// Service for communicating with the backend API
export interface AnalysisRequest {
  videoFile?: File;
  query: string;
  timestamp?: number;
}

export interface AnalysisResponse {
  text: string;
  audioUrl?: string;
  stats?: any;
  formations?: any;
  insights?: string[];
}

export class BackendService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000/api') {
    this.baseUrl = baseUrl;
  }

  // Send video for analysis
  async uploadVideo(file: File): Promise<{ videoId: string }> {
    const formData = new FormData();
    formData.append('video', file);

    const response = await fetch(`${this.baseUrl}/upload-video`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Send chat query to AI
  async sendChatQuery(request: AnalysisRequest): Promise<AnalysisResponse> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Chat query failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Get real-time stats
  async getStats(videoId?: string): Promise<any> {
    const url = videoId 
      ? `${this.baseUrl}/stats/${videoId}`
      : `${this.baseUrl}/stats`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Stats fetch failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Get formations analysis
  async getFormations(videoId: string, timestamp?: number): Promise<any> {
    const url = timestamp 
      ? `${this.baseUrl}/formations/${videoId}?timestamp=${timestamp}`
      : `${this.baseUrl}/formations/${videoId}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Formations fetch failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Process voice input
  async processVoiceInput(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice.wav');

    const response = await fetch(`${this.baseUrl}/voice-to-text`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Voice processing failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text;
  }
}

// Mock service for development/testing
export class MockBackendService extends BackendService {
  private mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async uploadVideo(file: File): Promise<{ videoId: string }> {
    await this.mockDelay(2000);
    return { videoId: 'mock-video-123' };
  }

  async sendChatQuery(request: AnalysisRequest): Promise<AnalysisResponse> {
    await this.mockDelay(1500);
    
    const responses = [
      {
        text: "Based on the video analysis, I can see the team is using a 4-3-3 formation with high pressing tactics. The wingers are staying wide to create attacking width.",
        insights: ["High press activation", "Wide attacking play", "Quick transitions"]
      },
      {
        text: "The defensive line is maintaining a high position, which creates space behind but allows for effective offside traps. I notice good communication between center-backs.",
        insights: ["High defensive line", "Offside trap usage", "CB communication"]
      },
      {
        text: "The midfield is showing excellent ball retention with short passing combinations. The central midfielder is dropping deep to collect the ball from defense.",
        insights: ["Ball retention focus", "Short passing game", "Deep-lying playmaker"]
      }
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return randomResponse;
  }

  async getStats(videoId?: string): Promise<any> {
    await this.mockDelay(800);
    
    return {
      possession: { home: Math.floor(Math.random() * 20) + 45, away: Math.floor(Math.random() * 20) + 35 },
      shots: { home: Math.floor(Math.random() * 8) + 8, away: Math.floor(Math.random() * 6) + 6 },
      passAccuracy: { home: Math.floor(Math.random() * 10) + 80, away: Math.floor(Math.random() * 10) + 75 },
      corners: { home: Math.floor(Math.random() * 4) + 4, away: Math.floor(Math.random() * 3) + 2 },
      fouls: { home: Math.floor(Math.random() * 5) + 8, away: Math.floor(Math.random() * 6) + 10 }
    };
  }

  async processVoiceInput(audioBlob: Blob): Promise<string> {
    await this.mockDelay(1000);
    const mockQuestions = [
      "What formation is the home team playing?",
      "How effective is their pressing?",
      "What are the key tactical patterns?",
      "Who are the most influential players?"
    ];
    
    return mockQuestions[Math.floor(Math.random() * mockQuestions.length)];
  }
}