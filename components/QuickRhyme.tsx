
import React, { useState } from 'react';
import { generateQuickRhymes } from '../services/geminiService';
import { RhymeResponse } from '../types';

export const QuickRhyme: React.FC = () => {
  const [word, setWord] = useState('');
  const [results, setResults] = useState<RhymeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFind = async () => {
    if (!word.trim()) return;
    setLoading(true);
    try {
      const data = await generateQuickRhymes(word);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-zinc-900/50 rounded-3xl border border-white/10 space-y-6">
      <div className="flex items-center gap-3">
        <i className="fas fa-bolt text-yellow-400"></i>
        <h3 className="font-bungee text-xl text-white">Instant Rhymes</h3>
      </div>
      
      <div className="flex gap-2">
        <input
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word (e.g. 'Street')"
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-white"
        />
        <button
          onClick={handleFind}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 rounded-xl transition-all"
        >
          {loading ? <i className="fas fa-spinner animate-spin"></i> : 'GET'}
        </button>
      </div>

      {results && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <span className="text-xs uppercase font-bold text-zinc-500 mb-2 block">Perfect Rhymes</span>
            <div className="flex flex-wrap gap-2">
              {results.rhymes.map((r, i) => (
                <span key={i} className="px-3 py-1 bg-zinc-800 rounded-lg text-sm text-yellow-200 border border-yellow-500/20">
                  {r}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-zinc-500 mb-2 block">Wordplay Tips</span>
            <ul className="space-y-2">
              {results.suggestions.map((s, i) => (
                <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                  <i className="fas fa-lightbulb text-yellow-600 mt-1"></i>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
