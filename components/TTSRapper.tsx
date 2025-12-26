
import React, { useState, useRef } from 'react';
import { generateRapTTS } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audio';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Music, Play, Loader2, AlertCircle } from 'lucide-react';

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
    <Card className="bg-purple-900/10 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Music className="text-purple-400" />
          <span className="font-bungee text-xl text-white">Rap Playback</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your lyrics here to hear the AI rap them back..."
          className="min-h-24 bg-black/40 border-white/10 text-white placeholder:text-zinc-500 resize-none"
        />
        <Button
          onClick={handleRap}
          disabled={isGenerating}
          className="w-full bg-white text-black font-bold hover:bg-gray-200"
          size="lg"
        >
          {isGenerating ? (
            <><Loader2 className="animate-spin" /> GENERATING...</>
          ) : (
            <><Play className="h-4 w-4" /> RAP IT BACK</>
          )}
        </Button>
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest">Powered by Gemini 2.5 TTS</p>
      </CardFooter>
    </Card>
  );
};
