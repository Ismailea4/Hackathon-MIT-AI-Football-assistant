<p align="center">
  <img src="assets/logo-hack.jpg" alt="Project Log## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- Python 3.8+
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Ismailea4/Hackathon-MIT-AI-Football-assistant.git
cd Hackathon-MIT-AI-Football-assistant
```

2. Install backend dependencies:

```bash
cd backend
python -m pip install -r requirements.txt
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:

```bash
cd backend
python -m uvicorn api:app --reload
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

Or run both simultaneously:

```bash
cd frontend
npm start
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## 📂 Project Structure

````
.
├── assets/                # Static assets (images, logos)
├── backend/
│   ├── api.py            # FastAPI backend server
│   ├── run.py            # Video processing script
│   ├── video_processor.py # Core analysis engine
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API integration
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   └── package.json      # Node.js dependencies
└── README.md             # Project documentation
```00"/>
</p>

<h1 align="center">⚽ AI Football Strategy & Analysis Assistant</h1>

<p align="center"><em>"In football, the worst blindness is only seeing the ball." – Nelson Falcão Rodrigues</em></p>

---

## 📌 Overview
The **AI Football Strategy & Analysis Assistant** is a conversational tool designed for football coaches and analysts.
It processes match footage, extracts performance insights, and provides tactical recommendations in real time — all through natural voice interaction.

Built for the **ElevenLabs AI Sports Coach Challenge**, our goal is to **bring professional-grade match analysis to every coach**, everywhere.

---

## 🚀 Features

### Video Analysis
- **🎥 Real-time Processing** — Live player detection and tracking
- **🏃 Team Identification** — Automatic team classification using color analysis
- **⚽ Ball Tracking** — Precise ball location and movement tracking
- **🥅 Goal Detection** — Automatic goal scoring detection

### Match Statistics
- **📊 Live Stats** — Real-time possession, shots, and pass accuracy
- **📈 Performance Metrics** — Detailed team and player statistics
- **🎯 Heat Maps** — Player position and movement visualization
- **⚔️ Formation Analysis** — Dynamic team formation detection

### Interactive Features
- **💬 AI Chat Interface** — Natural language queries about the match
- **🎤 Voice Control** — Hands-free operation and voice commands
- **🔊 Voice Responses** — AI-generated voice analysis using ElevenLabs
- **📱 Responsive Design** — Works on desktop and mobile devices

### Analysis Tools
- **� Tactical Insights** — AI-generated strategic recommendations
- **🔄 Real-time Updates** — Continuous statistical analysis
- **📺 Video Navigation** — Jump to key moments and events
- **📑 Match Reports** — Comprehensive post-match analysis

---

## 🛠 Tech Stack

### Frontend
- **React + TypeScript** — Modern web application framework
- **Vite** — Next-generation frontend tooling
- **TailwindCSS** — Utility-first CSS framework
- **Radix UI** — Unstyled, accessible components
- **Lucide icons** — Beautiful open-source icons
- **Axios** — Promise-based HTTP client

### Backend
- **FastAPI** — Modern, fast web framework for Python
- **OpenCV** — Computer vision and video processing
- **YOLOv8** — State-of-the-art object detection
- **NumPy** — Scientific computing and data processing
- **Python Multipart** — File upload handling
- **Ultralytics** — YOLOv8 Python interface

### AI/Voice Integration
- **ElevenLabs AI** — Voice synthesis and processing
- **WebSpeech API** — Browser speech recognition

---

## 🧰 Tools & Technologies

### [Frontend](./frontend)
- [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [Axios](https://axios-http.com/)
- [WebSpeech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

### [Backend](./backend)
- [FastAPI](https://fastapi.tiangolo.com/)
- [OpenCV](https://opencv.org/)
- [YOLOv8 (Ultralytics)](https://docs.ultralytics.com/)
- [NumPy](https://numpy.org/)
- [Python Multipart](https://andrew-d.github.io/python-multipart/)
- [Uvicorn](https://www.uvicorn.org/)
- [ElevenLabs API](https://elevenlabs.io/)

---

## 📂 Repository Structure
````

.
├── assets/ # Images, logo, UI mockups
├── backend/ # Video processing, AI analysis scripts
├── frontend/ # UI components & integration
├── README.md # Project documentation
└── requirements.txt # Python dependencies

````

## 🎯 Usage Guide

1. **Upload Video**
   - Use the video upload interface to select a match recording
   - Supported formats: MP4, AVI, MOV
   - Wait for initial analysis to complete

2. **View Statistics**
   - Real-time stats appear in the right panel
   - Formation analysis updates automatically
   - Track possession, shots, and other metrics

3. **Interactive Analysis**
   - Use the chat interface to ask questions
   - Enable voice control for hands-free operation
   - Receive AI-powered tactical insights

4. **Navigation**
   - Click on events to jump to specific moments
   - Use the timeline to scrub through the match
   - Toggle different visualization layers

## 🔧 Development

### API Endpoints

- `POST /upload-video` - Upload match footage
- `GET /stats` - Current match statistics
- `POST /chat` - Send match queries
- `GET /formations/{video_id}` - Team formation analysis
- `GET /health` - API status check

### Environment Variables

Frontend:
```env
VITE_API_URL=http://localhost:8000
VITE_ELEVENLABS_API_KEY=your_key_here
````

Backend:

```env
MODEL_PATH=yolov8n.pt
UPLOAD_DIR=uploads
DEBUG=False
```

## 💡 Inspiration

We believe every coach should have access to **data-driven tactical insights** — not just top-tier clubs. This project aims to **democratize match analysis** through AI, voice technology, and computer vision.

Our goals:

- Make professional analysis accessible to all levels
- Provide real-time insights during matches
- Enhance tactical understanding through AI
- Create an intuitive, natural interface

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---
