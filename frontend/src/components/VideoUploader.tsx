import React, { useState, useRef } from 'react';
import { Upload, Play, Pause, Volume2 } from 'lucide-react';
import { VideoData } from '../types';

interface VideoUploaderProps {
  onVideoUpload: (videoData: VideoData) => void;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoUpload }) => {
  const [videoData, setVideoData] = useState<VideoData>({
    file: null,
    url: null,
    duration: 0,
    currentTime: 0
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload delay for demo
    await new Promise(resolve => setTimeout(resolve, 1500));

    const url = URL.createObjectURL(file);
    const newVideoData = {
      file,
      url,
      duration: 0,
      currentTime: 0
    };

    setVideoData(newVideoData);
    onVideoUpload(newVideoData);
    setIsUploading(false);
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    setVideoData(prev => ({
      ...prev,
      currentTime: videoRef.current!.currentTime
    }));
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    
    setVideoData(prev => ({
      ...prev,
      duration: videoRef.current!.duration
    }));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="data-card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-navy-900 tracking-tight">Match Analysis</h2>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center space-x-2 bg-football-green-500 hover:bg-football-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Uploading...' : 'Upload Video'}</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {videoData.url ? (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={videoData.url}
              className="w-full h-64 object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-20">
              <button
                onClick={togglePlayPause}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transition-all transform hover:scale-110"
              >
                {isPlaying ? 
                  <Pause className="w-8 h-8 text-gray-800" /> : 
                  <Play className="w-8 h-8 text-gray-800 ml-1" />
                }
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatTime(videoData.currentTime)}</span>
              <span>{formatTime(videoData.duration)}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-football-green-500 h-2 rounded-full transition-all duration-200 shadow-sm"
                style={{ 
                  width: videoData.duration > 0 
                    ? `${(videoData.currentTime / videoData.duration) * 100}%` 
                    : '0%' 
                }}
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={togglePlayPause}
                className="flex items-center space-x-2 text-football-green-500 hover:text-football-green-600 transition-colors font-semibold"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span className="font-medium">{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              
              <div className="flex items-center space-x-2 text-gray-500">
                <Volume2 className="w-4 h-4" />
                <span className="text-sm font-medium">HD Quality</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50/50">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-football-green-500/10 rounded-full p-6">
              <Upload className="w-12 h-12 text-football-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-navy-900 mb-2 tracking-tight">
                Upload match footage
              </h3>
              <p className="text-gray-600 font-medium">
                Upload a video file to start tactical analysis
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};