import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onVoiceInput: (audioBlob: Blob) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  onSendMessage, 
  onVoiceInput 
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        onVoiceInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setMediaRecorder(null);
      setIsRecording(false);
    }
  };

  const playAudio = async (messageId: string, audioUrl?: string) => {
    if (!audioUrl) return;

    if (isPlaying === messageId) {
      audioRef.current?.pause();
      setIsPlaying(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(messageId);

      audioRef.current.onended = () => {
        setIsPlaying(null);
      };
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="data-card flex flex-col h-full">
      <div className="p-4 border-b border-gray-200/50">
        <h2 className="text-xl font-bold text-navy-900 tracking-tight">AI Analysis Chat</h2>
        <p className="text-sm text-gray-600 font-medium">Ask questions about tactics, formations, and strategy</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.isUser
                  ? 'bg-football-green-500 text-white shadow-lg'
                  : 'bg-white text-navy-800 border border-gray-200 shadow-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap font-medium">{message.text}</p>
              
              <div className={`flex items-center justify-between mt-2 ${
                message.isUser ? 'text-emerald-100' : 'text-gray-500'
              }`}>
                <span className="text-xs font-medium">{formatTime(message.timestamp)}</span>
                
                {!message.isUser && message.audioUrl && (
                  <button
                    onClick={() => playAudio(message.id, message.audioUrl)}
                    className={`ml-2 p-1 rounded transition-colors ${
                      message.isUser 
                        ? 'hover:bg-football-green-600' 
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    {isPlaying === message.id ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200/50">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about tactics, formations, player movements..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-football-green-500 focus:border-transparent font-medium"
              rows={1}
            />
          </div>
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-3 rounded-lg transition-colors ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
            title={isRecording ? 'Stop recording' : 'Start voice recording'}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-3 bg-football-green-500 hover:bg-football-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-all transform hover:scale-105 shadow-lg"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {isRecording && (
          <div className="mt-2 flex items-center space-x-2 text-red-600">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
            <span className="text-sm font-semibold">Recording...</span>
          </div>
        )}
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
};