import cv2
import numpy as np
from ultralytics import YOLO
import json
import os

class VideoProcessor:
    def __init__(self, model_path='yolov8n.pt'):
        self.model = YOLO(model_path)
        self.current_stats = {
            'possession': {'home': 50, 'away': 50},
            'shots': {'home': 0, 'away': 0},
            'passAccuracy': {'home': 85, 'away': 82},
            'corners': {'home': 0, 'away': 0},
            'fouls': {'home': 0, 'away': 0},
            'formations': {
                'home': '4-3-3',
                'away': '4-4-2'
            }
        }

    def process_frame(self, frame):
        """Process a single frame and update statistics."""
        results = self.model(frame)
        self.frame_width = frame.shape[1]
        # Process detection results
        for result in results:
            boxes = result.boxes.cpu().numpy()
            for box in boxes:
                # Process detected players and ball
                self._update_stats_from_detection(box)

    def _update_stats_from_detection(self, box):
        """Update statistics based on detected objects."""
        # Example: Update possession based on ball position
        if box.cls == 0:  # Assuming 0 is ball class
            x_center = (box.xyxy[0][0] + box.xyxy[0][2]) / 2
            if x_center < self.frame_width / 2:
                self.current_stats['possession']['home'] += 0.1
                self.current_stats['possession']['away'] -= 0.1
            else:
                self.current_stats['possession']['home'] -= 0.1
                self.current_stats['possession']['away'] += 0.1

            # Normalize possession values
            total = self.current_stats['possession']['home'] + self.current_stats['possession']['away']
            self.current_stats['possession']['home'] = round((self.current_stats['possession']['home'] / total) * 100, 1)
            self.current_stats['possession']['away'] = round((self.current_stats['possession']['away'] / total) * 100, 1)

    def process_video(self, video_path, output_path='stats_latest.json'):
        """Process video file and generate statistics."""
        cap = cv2.VideoCapture(video_path)
        frame_count = 0
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            # Process every 30th frame to improve performance
            if frame_count % 30 == 0:
                self.process_frame(frame)
                # Save current stats
                self._save_stats(output_path)
                
            frame_count += 1
            
        cap.release()
        return self.current_stats

    def _save_stats(self, output_path):
        """Save current statistics to JSON file."""
        with open(output_path, 'w') as f:
            json.dump(self.current_stats, f)

    def analyze_formation(self, frame):
        """Analyze team formations from a frame."""
        results = self.model(frame)
        # Process player positions to determine formation
        # This would use clustering to group player positions
        # and determine the formation pattern
        return {
            'home': self.current_stats['formations']['home'],
            'away': self.current_stats['formations']['away']
        }

    def get_current_stats(self):
        """Return current match statistics."""
        return self.current_stats
