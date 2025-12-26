
import React from 'react';
import { Mic, Circle } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="p-6 border-b border-purple-500/30 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-lg neon-border">
            <Mic className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bungee neon-text tracking-tighter">
            Cypher<span className="text-purple-400">Genius</span>
          </h1>
        </div>
        <div className="hidden md:flex gap-4 items-center">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30 flex items-center gap-2">
            <Circle className="h-2 w-2 fill-green-400" /> SYSTEM LIVE
          </span>
          <div className="text-gray-400 text-sm italic">"The AI Hypeman You Needed"</div>
        </div>
      </div>
    </header>
  );
};
