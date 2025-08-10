import React, { useState, useEffect } from 'react';
import { VideoUploader } from './components/VideoUploader';
import { ChatWindow } from './components/ChatWindow';
import { StatsPanel } from './components/StatsPanel';
import { VoiceControls } from './components/VoiceControls';
import { VideoData, ChatMessage, FootballStats } from './types';
import { mockStats, mockMessages, mockTeams } from './utils/mockData';
import { ElevenLabsService, WebSpeechService } from './services/elevenLabsService';
import { BackendService, MockBackendService } from './services/backendService';
import { Activity, Zap, Target, MessageCircle, X, Settings } from 'lucide-react';

function App() {
  // State management
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [stats, setStats] = useState<FootballStats>(mockStats);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showVoiceControls, setShowVoiceControls] = useState(false);

  // Services
  const backendService = new MockBackendService(); // Switch to BackendService for production
  const speechService = new WebSpeechService();
  
  // Replace with your ElevenLabs API key
  // const elevenLabsService = new ElevenLabsService('your-elevenlabs-api-key');

  // Auto-update stats every 5 seconds for demo
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const newStats = await backendService.getStats();
        setStats(newStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleVideoUpload = async (uploadedVideoData: VideoData) => {
    setVideoData(uploadedVideoData);
    
    if (uploadedVideoData.file) {
      try {
        const result = await backendService.uploadVideo(uploadedVideoData.file);
        console.log('Video uploaded:', result.videoId);
        
        // Add system message about successful upload
        const systemMessage: ChatMessage = {
          id: Date.now().toString(),
          text: "Video uploaded successfully! I'm now analyzing the match footage. You can ask me about formations, tactics, and key moments.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, systemMessage]);
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  };

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Set analyzing state
    setIsAnalyzing(true);

    try {
      // Get AI response
      const response = await backendService.sendChatQuery({
        query: text,
        videoFile: videoData?.file
      });

      // Create AI response message
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        audioUrl: response.audioUrl
      };

      setMessages(prev => [...prev, aiMessage]);

      // Generate speech if enabled
      if (isSpeaking && !response.audioUrl) {
        try {
          await speechService.textToSpeech(response.text, { rate: 0.9 });
        } catch (error) {
          console.error('Error generating speech:', error);
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble processing your request. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsAnalyzing(false);
  };

  const handleVoiceInput = async (audioBlob: Blob) => {
    try {
      const transcript = await backendService.processVoiceInput(audioBlob);
      if (transcript) {
        handleSendMessage(transcript);
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
    }
  };

  const handleToggleListening = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // Start listening logic
      speechService.speechToText()
        .then(transcript => {
          if (transcript) {
            handleSendMessage(transcript);
          }
          setIsListening(false);
        })
        .catch(error => {
          console.error('Voice recognition error:', error);
          setIsListening(false);
        });
    }
  };

  const handleToggleSpeaking = () => {
    if (isSpeaking && speechService.isSpeaking()) {
      speechService.stopSpeech();
    }
    setIsSpeaking(!isSpeaking);
  };

  // Add toggle chat function
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Header */}
      <div className="bg-subtle-gradient border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-football-green-500 rounded-lg p-2 shadow-lg">
                <img
                    src="/logo-hack.jpg"
                    alt="Logo"
                    className="w-24 h-24 object-contain"
                  />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">AI Football Analytics</h1>
                <p className="text-gray-300 font-medium">Professional tactical analysis powered by AI</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAnalyzing && (
                <div className="flex items-center space-x-2 text-football-green-400">
                  <Activity className="w-5 h-5 animate-pulse" />
                  <span className="text-sm font-semibold">Analyzing...</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-gray-300">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium">Live Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main Content */}
        <div className="flex gap-6">
          {/* Left Column - Video and Live Composition */}
          <div className="flex-grow space-y-6">
            {/* Video Section */}
            <div className="relative">
              <div className="w-full aspect-video bg-navy-800 rounded-lg overflow-hidden relative">
                <VideoUploader onVideoUpload={handleVideoUpload} />
                {/* Voice Controls Button */}
                <button
                  onClick={() => setShowVoiceControls(!showVoiceControls)}
                  className="absolute bottom-3 right-3 z-20 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                  title="Voice Controls"
                >
                  <Settings className="w-5 h-5 text-navy-800" />
                </button>
                
                {/* Voice Controls Popover */}
                {showVoiceControls && (
                  <div className="absolute bottom-14 right-3 z-30 flex space-x-3">
                    <div className="bg-white rounded-lg shadow-xl w-60">
                      <VoiceControls
                        isListening={isListening}
                        isSpeaking={isSpeaking}
                        onToggleListening={handleToggleListening}
                        onToggleSpeaking={handleToggleSpeaking}
                        compact
                        onClose={() => setShowVoiceControls(false)}
                      />
                    </div>
                    <div className="bg-white rounded-lg shadow-xl w-60">
                      <VoiceControls
                        isListening={isListening}
                        isSpeaking={isSpeaking}
                        onToggleListening={handleToggleListening}
                        onToggleSpeaking={handleToggleSpeaking}
                        compact
                        settingsOnly
                        onClose={() => setShowVoiceControls(false)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Composition Panel - Directly below video */}
            <div className="bg-navy-800 rounded-lg p-4">
              <h2 className="text-xl font-bold text-white mb-4">Live Team Composition</h2>
              <div className="aspect-[16/9] bg-football-green-900/30 rounded-lg p-4">
                {/* Placeholder for live composition - To be implemented later */}
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">Team composition visualization will be displayed here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats Panel */}
          <div className="w-1/3 flex-shrink-0">
            <StatsPanel
              stats={stats}
              homeTeam={mockTeams.home.name}
              awayTeam={mockTeams.away.name}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm font-medium">
            Professional Football Analytics
            <br />
            • Upload match footage and start tactical analysis
          </p>
        </div>
      </div>

      {/* Floating Chat Button and Window - fixed to bottom right of page */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 bg-football-green-500 p-3 rounded-full shadow-lg hover:bg-football-green-600 transition-colors"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }}
      >
        {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[400px] bg-navy-800 rounded-lg shadow-xl border border-navy-700 z-50 flex flex-col"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}
        >
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            onVoiceInput={handleVoiceInput}
          />
        </div>
      )}
    </div>
  );
}

export default App;