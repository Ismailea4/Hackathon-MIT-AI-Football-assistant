import React, { useState } from 'react';
import { Headphones, Mic, Settings, Volume2 } from 'lucide-react';

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  onToggleListening: () => void;
  onToggleSpeaking: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  isSpeaking,
  onToggleListening,
  onToggleSpeaking
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    speed: 1.0,
    pitch: 1.0,
    volume: 0.8
  });

  return (
    <div className="data-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-navy-900 tracking-tight">Voice Controls</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full ${
              isListening ? 'bg-red-100 text-red-600' : 'bg-football-green-500/10 text-football-green-500'
            }`}>
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-navy-800 tracking-tight">Voice Input</h3>
              <p className="text-sm text-gray-600 font-medium">
                {isListening ? 'Listening...' : 'Click to start listening'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onToggleListening}
            className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-football-green-500 hover:bg-football-green-600 text-white'
            }`}
          >
            {isListening ? 'Stop' : 'Listen'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full ${
              isSpeaking ? 'bg-navy-800/10 text-navy-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-navy-800 tracking-tight">Voice Output</h3>
              <p className="text-sm text-gray-600 font-medium">
                {isSpeaking ? 'Speaking...' : 'AI voice responses'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onToggleSpeaking}
            className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg ${
              isSpeaking
                ? 'bg-navy-800 hover:bg-navy-700 text-white'
                : 'bg-navy-800 hover:bg-navy-700 text-white'
            }`}
          >
            {isSpeaking ? 'Mute' : 'Enable'}
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 space-y-4">
          <h4 className="font-semibold text-navy-800 tracking-tight">Voice Settings</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-1">
                Speech Speed: {voiceSettings.speed}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceSettings.speed}
                onChange={(e) => setVoiceSettings(prev => ({
                  ...prev,
                  speed: parseFloat(e.target.value)
                }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-1">
                Voice Pitch: {voiceSettings.pitch}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceSettings.pitch}
                onChange={(e) => setVoiceSettings(prev => ({
                  ...prev,
                  pitch: parseFloat(e.target.value)
                }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-1">
                Volume: {Math.round(voiceSettings.volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceSettings.volume}
                onChange={(e) => setVoiceSettings(prev => ({
                  ...prev,
                  volume: parseFloat(e.target.value)
                }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-football-green-500/10 rounded-lg border border-football-green-500/20">
        <div className="flex items-center space-x-2 mb-2">
          <Headphones className="w-4 h-4 text-football-green-500" />
          <span className="text-sm font-semibold text-football-green-600 tracking-tight">ElevenLabs AI Voice</span>
        </div>
        <p className="text-xs text-football-green-700 font-medium">
          High-quality AI voice synthesis powered by ElevenLabs
        </p>
      </div>
    </div>
  );
};