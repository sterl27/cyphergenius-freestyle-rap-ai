
import React, { useState } from 'react';
import { Header } from './components/Header';
import { LiveRapSession } from './components/LiveRapSession';
import { LyricStudio } from './components/LyricStudio';
import { QuickRhyme } from './components/QuickRhyme';
import { TTSRapper } from './components/TTSRapper';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppMode } from './types';
import { Button } from './components/ui/button';
import { Mic, Feather } from 'lucide-react';

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
            <Button
              onClick={() => setActiveTab(AppMode.LIVE_CYPHER)}
              variant={activeTab === AppMode.LIVE_CYPHER ? 'default' : 'outline'}
              className={`w-full justify-start gap-4 h-14 text-base ${
                activeTab === AppMode.LIVE_CYPHER
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40' 
                : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 border-zinc-700'
              }`}
            >
              <Mic className="h-5 w-5" />
              <span className="font-bold">LIVE CYPHER</span>
            </Button>
            <Button
              onClick={() => setActiveTab(AppMode.LYRIC_STUDIO)}
              variant={activeTab === AppMode.LYRIC_STUDIO ? 'default' : 'outline'}
              className={`w-full justify-start gap-4 h-14 text-base ${
                activeTab === AppMode.LYRIC_STUDIO
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40' 
                : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 border-zinc-700'
              }`}
            >
              <Feather className="h-5 w-5" />
              <span className="font-bold">LYRIC STUDIO</span>
            </Button>
            
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setActiveTab(AppMode.LIVE_CYPHER)}
          className={`h-12 w-12 rounded-full ${activeTab === AppMode.LIVE_CYPHER ? 'text-purple-400' : 'text-zinc-500'}`}
        >
          <Mic className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setActiveTab(AppMode.LYRIC_STUDIO)}
          className={`h-12 w-12 rounded-full ${activeTab === AppMode.LYRIC_STUDIO ? 'text-purple-400' : 'text-zinc-500'}`}
        >
          <Feather className="h-6 w-6" />
        </Button>
      </div>
    </div>
    </ErrorBoundary>
  );
};

export default App;
