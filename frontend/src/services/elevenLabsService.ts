// ElevenLabs API service for voice synthesis and speech-to-text
export class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Text-to-Speech using ElevenLabs
  async textToSpeech(text: string, voiceId: string = 'jsCqWAovK2LkecY7zXl4'): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs TTS error: ${response.statusText}`);
    }

    return response.blob();
  }

  // Speech-to-Text (using Web Speech API as fallback)
  async speechToText(audioBlob: Blob): Promise<string> {
    // Note: ElevenLabs doesn't provide STT directly
    // This is a placeholder for integrating with Web Speech API or other STT services
    return new Promise((resolve, reject) => {
      const recognition = new (window as any).webkitSpeechRecognition() || new (window as any).SpeechRecognition();
      
      if (!recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event: any) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      // Convert blob to audio and start recognition
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play().then(() => {
        recognition.start();
      });
    });
  }

  // Get available voices
  async getVoices(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: {
        'xi-api-key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs voices error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.voices;
  }
}

// Alternative Web Speech API implementation
export class WebSpeechService {
  private synthesis: SpeechSynthesis;
  private recognition: any;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.recognition = new (window as any).webkitSpeechRecognition() || new (window as any).SpeechRecognition();
  }

  // Text-to-Speech using Web Speech API
  async textToSpeech(text: string, options: { rate?: number; pitch?: number; volume?: number } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
      
      this.synthesis.speak(utterance);
    });
  }

  // Speech-to-Text using Web Speech API
  async speechToText(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      this.recognition.onerror = (event: any) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.start();
    });
  }

  // Stop current speech
  stopSpeech(): void {
    this.synthesis.cancel();
  }

  // Check if speaking
  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }
}