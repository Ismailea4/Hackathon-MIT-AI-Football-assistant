import React, { useState } from 'react';
import { Headphones, Mic, Settings, Volume2, X } from 'lucide-react';

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  onToggleListening: () => void;
  onToggleSpeaking: () => void;
  compact?: boolean;
  settingsOnly?: boolean;
  onClose?: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  isSpeaking,
  onToggleListening,
  onToggleSpeaking,
  compact = false,
  settingsOnly = false,
  onClose
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    speed: 1.0,
    pitch: 1.0,
    volume: 0.8
  });

  if (settingsOnly) {
    return (
      <div className={compact ? "p-3" : "data-card p-6"}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-navy-800">Voice Settings</h3>
          {onClose && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              Speed: {voiceSettings.speed}x
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
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              Pitch: {voiceSettings.pitch}x
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
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
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
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? "p-3" : "data-card p-6"}>
      <h3 className="text-sm font-semibold text-navy-800 mb-4">
        {compact ? 'Voice Controls' : 'Voice Input and Output'}
      </h3>
      {onClose && (
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X className="w-4 h-4" />
        </button>
      )}
      <div className={`space-y-${compact ? '2' : '4'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full ${
              isListening ? 'bg-red-100 text-red-600' : 'bg-football-green-500/10 text-football-green-500'
            }`}>
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-navy-800 tracking-tight text-xs">Voice Input</h3>
              <p className="text-xs text-gray-600">
                {isListening ? 'Listening...' : 'Click to start'}
              </p>
            </div>
          </div>
          <button
            onClick={onToggleListening}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105 shadow ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-football-green-500 hover:bg-football-green-600 text-white'
            }`}
          >
            {isListening ? 'Stop' : 'Listen'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full ${
              isSpeaking ? 'bg-navy-800/10 text-navy-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-navy-800 tracking-tight text-xs">Voice Output</h3>
              <p className="text-xs text-gray-600">
                {isSpeaking ? 'Speaking...' : 'AI voice'}
              </p>
            </div>
          </div>
          <button
            onClick={onToggleSpeaking}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105 shadow ${
              isSpeaking
                ? 'bg-navy-800 hover:bg-navy-700 text-white'
                : 'bg-navy-800 hover:bg-navy-700 text-white'
            }`}
          >
            {isSpeaking ? 'Mute' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  );
};