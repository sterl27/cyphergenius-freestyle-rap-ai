
import React, { useState, useRef } from 'react';
import { generateRapTTS } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audio';

export const TTSRapper: React.FC = () => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Cleanup on component unmount
  React.useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const handleRap = async () => {
    if (!text.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);
    
    try {
      const base64 = await generateRapTTS(text);
      if (base64) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const buffer = await decodeAudioData(decode(base64), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate audio. Check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 bg-purple-900/10 rounded-3xl border border-purple-500/20 space-y-4">
      <div className="flex items-center gap-3">
        <i className="fas fa-music text-purple-400"></i>
        <h3 className="font-bungee text-xl text-white">Rap Playback</h3>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your lyrics here to hear the AI rap them back..."
        className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-purple-500 text-white text-sm"
      />
      <button
        onClick={handleRap}
        disabled={isGenerating}
        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <><i className="fas fa-spinner animate-spin"></i> GENERATING...</>
        ) : (
          <><i className="fas fa-play"></i> RAP IT BACK</>
        )}
      </button>
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}
      <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest">Powered by Gemini 2.5 TTS</p>
    </div>
  );
};
