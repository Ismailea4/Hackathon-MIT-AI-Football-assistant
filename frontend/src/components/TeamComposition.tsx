import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player, TeamFormation } from '../types';

// Initial 4-3-3 formation positions (normalized coordinates 0-1)
const initialFormation: TeamFormation = {
  home: [
    { id: 1, team: 'home', x: 0.1, y: 0.5, number: 1 },  // GK
    { id: 2, team: 'home', x: 0.2, y: 0.2, number: 2 },  // Defense
    { id: 3, team: 'home', x: 0.2, y: 0.4, number: 3 },
    { id: 4, team: 'home', x: 0.2, y: 0.6, number: 4 },
    { id: 5, team: 'home', x: 0.2, y: 0.8, number: 5 },
    { id: 6, team: 'home', x: 0.4, y: 0.3, number: 6 },  // Midfield
    { id: 7, team: 'home', x: 0.4, y: 0.5, number: 7 },
    { id: 8, team: 'home', x: 0.4, y: 0.7, number: 8 },
    { id: 9, team: 'home', x: 0.6, y: 0.3, number: 9 },  // Attack
    { id: 10, team: 'home', x: 0.6, y: 0.5, number: 10 },
    { id: 11, team: 'home', x: 0.6, y: 0.7, number: 11 }
  ],
  away: [
    { id: 12, team: 'away', x: 0.9, y: 0.5, number: 1 }, // GK
    { id: 13, team: 'away', x: 0.8, y: 0.2, number: 2 }, // Defense
    { id: 14, team: 'away', x: 0.8, y: 0.4, number: 3 },
    { id: 15, team: 'away', x: 0.8, y: 0.6, number: 4 },
    { id: 16, team: 'away', x: 0.8, y: 0.8, number: 5 },
    { id: 17, team: 'away', x: 0.6, y: 0.3, number: 6 }, // Midfield
    { id: 18, team: 'away', x: 0.6, y: 0.5, number: 7 },
    { id: 19, team: 'away', x: 0.6, y: 0.7, number: 8 },
    { id: 20, team: 'away', x: 0.4, y: 0.3, number: 9 }, // Attack
    { id: 21, team: 'away', x: 0.4, y: 0.5, number: 10 },
    { id: 22, team: 'away', x: 0.4, y: 0.7, number: 11 }
  ]
};

const TeamComposition: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([
    ...initialFormation.home,
    ...initialFormation.away
  ]);
  
  const animationFrame = useRef<number | undefined>(undefined);
  const lastUpdate = useRef<number>(0);

  const movePlayer = useCallback((player: Player): Player => {
    const speed = 0.01; // Maximum movement per update
    const newX = player.x + (Math.random() - 0.5) * speed;
    const newY = player.y + (Math.random() - 0.5) * speed;

    // Keep players within bounds (0-1)
    return {
      ...player,
      x: Math.max(0.05, Math.min(0.95, newX)),
      y: Math.max(0.05, Math.min(0.95, newY))
    };
  }, []);

  const updatePositions = useCallback((timestamp: number) => {
    if (timestamp - lastUpdate.current >= 500) { // Update every 500ms
      setPlayers(currentPlayers =>
        currentPlayers.map(player => movePlayer(player))
      );
      lastUpdate.current = timestamp;
    }
    animationFrame.current = requestAnimationFrame(updatePositions);
  }, [movePlayer]);

  useEffect(() => {
    animationFrame.current = requestAnimationFrame(updatePositions);
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [updatePositions]);

  return (
    <div className="w-full h-full relative">
      {/* Football pitch */}
      <div className="w-full aspect-[16/9] bg-football-green-500 relative rounded-lg overflow-hidden">
        {/* Center line */}
        <div className="absolute top-0 left-1/2 w-px h-full bg-white/50" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/50 rounded-full" />
        
        {/* Penalty areas */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-1/6 h-2/5 border-2 border-white/50" />
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1/6 h-2/5 border-2 border-white/50" />

        {/* Players */}
        {players.map((player) => (
          <div
            key={player.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 shadow-lg ${
              player.team === 'home' 
                ? 'bg-lime-500 text-white' 
                : 'bg-gray-500 text-white'
            }`}
            style={{
              left: `${player.x * 100}%`,
              top: `${player.y * 100}%`,
            }}
          >
            {player.number}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamComposition;
