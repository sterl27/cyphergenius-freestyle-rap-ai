
import React, { useState } from 'react';
import { generateQuickRhymes } from '../services/geminiService';
import { saveRhymeQuery, isSupabaseConfigured } from '../services/supabaseClient';
import { RhymeResponse } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

export const QuickRhyme: React.FC = () => {
  const [word, setWord] = useState('');
  const [results, setResults] = useState<RhymeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFind = async () => {
    if (!word.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await generateQuickRhymes(word);
      setResults(data);
      
      // Save to Supabase if configured
      if (isSupabaseConfigured()) {
        try {
          await saveRhymeQuery({
            word: data.word,
            rhymes: data.rhymes,
            suggestions: data.suggestions,
          });
        } catch (err) {
          console.error('Failed to save rhyme query to cloud:', err);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to find rhymes. Check your API key.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900/50 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Sparkles className="text-yellow-400" />
          <span className="font-bungee text-xl text-white">Instant Rhymes</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFind()}
            placeholder="Enter a word (e.g. 'Street')"
            className="flex-1 bg-black/40 border-white/10 text-white placeholder:text-zinc-500"
          />
          <Button
            onClick={handleFind}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'GET'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

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
      </CardContent>
    </Card>
  );
};
