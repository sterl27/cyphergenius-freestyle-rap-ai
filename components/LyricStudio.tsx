
import React, { useState, useEffect, useRef } from 'react';
import { getGeminiChat } from '../services/geminiService';
import { Message } from '../types';

const STORAGE_KEY = 'cyphergenius_lyric_history';

// Type for Gemini Chat
type GeminiChat = {
  sendMessage: (options: { message: string }) => Promise<{ text: string }>;
};

export const LyricStudio: React.FC = () => {
  // Initialize state from localStorage or default welcome message
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load saved lyrics", e);
      }
    }
    return [{
      id: 'welcome',
      role: 'assistant',
      text: "Yo, I'm your lyric consultant. Drop some bars you're working on, or ask me for a theme to start a battle.",
      timestamp: Date.now()
    }];
  });
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<GeminiChat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini Chat
  useEffect(() => {
    chatRef.current = getGeminiChat();
  }, []);

  // Save to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: input });
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: response.text, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = { 
        id: 'error-' + Date.now(), 
        role: 'assistant', 
        text: "My bad, lost the connection to the booth. Try sending that again.", 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Delete all session lyrics? This cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY);
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        text: "Yo, I'm your lyric consultant. Drop some bars you're working on, or ask me for a theme to start a battle.",
        timestamp: Date.now()
      }]);
    }
  };

  const downloadLyrics = () => {
    const content = messages
      .map(m => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.role === 'user' ? 'YOU' : 'AI'}:\n${m.text}\n`)
      .join('\n---\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cypher_genius_lyrics_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/30 rounded-3xl border border-white/10 overflow-hidden">
      <div className="p-4 bg-purple-900/20 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bungee text-purple-400">LYRIC STUDIO PRO</span>
          {messages.length > 1 && (
            <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30 uppercase font-bold tracking-tighter hidden sm:inline">
              Auto-Saved
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={downloadLyrics}
            className="text-zinc-400 hover:text-white transition-colors text-xs flex items-center gap-1.5 uppercase font-bold bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-white/5"
            title="Download lyrics as text file"
          >
            <i className="fas fa-download"></i>
            <span className="hidden sm:inline">Export</span>
          </button>
          <button 
            onClick={clearHistory}
            className="text-zinc-500 hover:text-red-400 transition-colors text-xs flex items-center gap-1.5 uppercase font-bold bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-white/5"
            title="Clear all lyrics"
          >
            <i className="fas fa-trash-alt"></i>
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl whitespace-pre-wrap shadow-xl ${
              m.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-zinc-800 text-zinc-300 rounded-tl-none border border-white/5'
            }`}>
              {m.text}
              <div className="text-[9px] mt-2 opacity-40 text-right uppercase tracking-widest font-bold">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 p-4 rounded-2xl flex gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-black/40 border-t border-white/10 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Enter lyrics or ask for tips..."
          className="flex-1 bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-xl w-12 flex items-center justify-center transition-all active:scale-95"
        >
          <i className={`fas ${isLoading ? 'fa-spinner animate-spin' : 'fa-paper-plane'}`}></i>
        </button>
      </div>
    </div>
  );
};
