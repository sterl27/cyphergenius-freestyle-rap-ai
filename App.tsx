
import React, { useState } from 'react';
import { Header } from './components/Header';
import { LiveRapSession } from './components/LiveRapSession';
import { LyricStudio } from './components/LyricStudio';
import { QuickRhyme } from './components/QuickRhyme';
import { TTSRapper } from './components/TTSRapper';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppMode } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppMode>(AppMode.LIVE_CYPHER);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar (Mobile Sticky Bottom / Desktop Left) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="sticky top-24 space-y-2">
            <button 
              onClick={() => setActiveTab(AppMode.LIVE_CYPHER)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                activeTab === AppMode.LIVE_CYPHER 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' 
                : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <i className="fas fa-microphone-alt"></i>
              <span className="font-bold">LIVE CYPHER</span>
            </button>
            <button 
              onClick={() => setActiveTab(AppMode.LYRIC_STUDIO)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                activeTab === AppMode.LYRIC_STUDIO 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' 
                : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <i className="fas fa-feather-alt"></i>
              <span className="font-bold">LYRIC STUDIO</span>
            </button>
            
            <div className="pt-8 space-y-4">
              <QuickRhyme />
              <TTSRapper />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 h-[calc(100vh-160px)] min-h-[500px]">
          {activeTab === AppMode.LIVE_CYPHER && (
            <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <LiveRapSession />
            </div>
          )}
          {activeTab === AppMode.LYRIC_STUDIO && (
            <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <LyricStudio />
            </div>
          )}
        </div>
      </main>

      {/* Footer Mobile Nav Placeholder */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-lg border-t border-white/10 flex justify-around">
        <button 
          onClick={() => setActiveTab(AppMode.LIVE_CYPHER)}
          className={`p-3 rounded-full ${activeTab === AppMode.LIVE_CYPHER ? 'text-purple-400' : 'text-zinc-500'}`}
        >
          <i className="fas fa-microphone-alt text-2xl"></i>
        </button>
        <button 
          onClick={() => setActiveTab(AppMode.LYRIC_STUDIO)}
          className={`p-3 rounded-full ${activeTab === AppMode.LYRIC_STUDIO ? 'text-purple-400' : 'text-zinc-500'}`}
        >
          <i className="fas fa-feather-alt text-2xl"></i>
        </button>
      </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
