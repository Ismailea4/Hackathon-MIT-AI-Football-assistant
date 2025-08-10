import React from 'react';
import { 
  TrendingUp, 
  Target, 
  Users, 
  Flag, 
  AlertTriangle, 
  ChevronRight,
  Layout,
  Clock,
  Activity
} from 'lucide-react';
import { FootballStats } from '../types';
import { generateAnalysis } from '../utils/mockData';

interface StatsPanelProps {
  stats: FootballStats;
  homeTeam: string;
  awayTeam: string;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  homeValue: number;
  awayValue: number;
  unit?: string;
  homeColor: string;
  awayColor: string;
}

const StatItem: React.FC<StatItemProps> = ({ 
  icon, 
  label, 
  homeValue, 
  awayValue, 
  unit = '', 
  homeColor, 
  awayColor 
}) => {
  const total = homeValue + awayValue;
  const homePercentage = total > 0 ? (homeValue / total) * 100 : 50;
  
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center space-x-2 mb-3">
        {icon}
        <span className="font-semibold text-navy-800 tracking-tight">{label}</span>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-bold tracking-tight" style={{ color: homeColor }}>
          {homeValue}{unit}
        </span>
        <span className="text-lg font-bold tracking-tight" style={{ color: awayColor }}>
          {awayValue}{unit}
        </span>
      </div>
      
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div 
          className="absolute left-0 top-0 h-full transition-all duration-700 ease-out rounded-full shadow-sm"
          style={{ 
            width: `${homePercentage}%`,
            backgroundColor: homeColor
          }}
        />
        <div 
          className="absolute right-0 top-0 h-full transition-all duration-700 ease-out rounded-full shadow-sm"
          style={{ 
            width: `${100 - homePercentage}%`,
            backgroundColor: awayColor
          }}
        />
      </div>
    </div>
  );
};

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats, homeTeam, awayTeam }) => {
  const homeColor = '#2E9E48';
  const awayColor = '#0C1A27';

  return (
    <div className="data-card p-6 h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-navy-900 mb-4 tracking-tight">Live Match Statistics</h2>
        
        <div className="flex justify-between items-center mb-6">
          <div className="text-center">
            <div 
              className="text-2xl font-bold mb-1 tracking-tight"
              style={{ color: homeColor }}
            >
              {homeTeam}
            </div>
            <div className="text-sm text-gray-500 font-semibold tracking-wider">HOME</div>
          </div>
          
          <div className="text-3xl font-bold text-navy-700 tracking-tight">VS</div>
          
          <div className="text-center">
            <div 
              className="text-2xl font-bold mb-1 tracking-tight"
              style={{ color: awayColor }}
            >
              {awayTeam}
            </div>
            <div className="text-sm text-gray-500 font-semibold tracking-wider">AWAY</div>
          </div>
        </div>
      </div>

      {/* Formation Display */}
      {stats.formations && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center space-x-2 mb-3">
            <Layout className="w-5 h-5 text-football-green-500" />
            <span className="font-semibold text-navy-800">Formations</span>
          </div>
          <div className="flex justify-between">
            <div className="text-center">
              <span className="text-2xl font-bold" style={{ color: homeColor }}>
                {stats.formations.home}
              </span>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold" style={{ color: awayColor }}>
                {stats.formations.away}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <StatItem
          icon={<Users className="w-5 h-5 text-football-green-500" />}
          label="Possession"
          homeValue={stats.possession.home}
          awayValue={stats.possession.away}
          unit="%"
          homeColor={homeColor}
          awayColor={awayColor}
        />
        
        <StatItem
          icon={<Target className="w-5 h-5 text-football-green-500" />}
          label="Shots"
          homeValue={stats.shots.home}
          awayValue={stats.shots.away}
          homeColor={homeColor}
          awayColor={awayColor}
        />
        
        <StatItem
          icon={<TrendingUp className="w-5 h-5 text-football-green-500" />}
          label="Pass Accuracy"
          homeValue={stats.passAccuracy.home}
          awayValue={stats.passAccuracy.away}
          unit="%"
          homeColor={homeColor}
          awayColor={awayColor}
        />
        
        <StatItem
          icon={<Flag className="w-5 h-5 text-football-green-500" />}
          label="Corners"
          homeValue={stats.corners.home}
          awayValue={stats.corners.away}
          homeColor={homeColor}
          awayColor={awayColor}
        />
        
        <StatItem
          icon={<AlertTriangle className="w-5 h-5 text-football-green-500" />}
          label="Fouls"
          homeValue={stats.fouls.home}
          awayValue={stats.fouls.away}
          homeColor={homeColor}
          awayColor={awayColor}
        />
      </div>

      <div className="mt-6 p-4 bg-navy-800 rounded-lg border border-navy-700">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-2 h-2 bg-football-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-white tracking-tight">Live Analysis</span>
        </div>
        <div className="space-y-2">
          {generateAnalysis(stats).map((analysis, index) => (
            <div key={index} className="flex items-start space-x-2 text-sm">
              <ChevronRight className="w-4 h-4 text-football-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-gray-300 font-medium leading-tight">
                {analysis}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};