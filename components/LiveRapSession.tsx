
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { decode, decodeAudioData, createBlob } from '../utils/audio';

// Type for the Live Session
type LiveSession = {
  close: () => void;
  sendRealtimeInput: (input: { media: { data: string; mimeType: string } }) => void;
};

export const LiveRapSession: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'rapping'>('idle');
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<LiveSession | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsActive(false);
    setStatus('idle');
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopSession();
      audioContextRef.current?.close();
      outputAudioContextRef.current?.close();
    };
  }, [stopSession]);

  const startSession = async () => {
    setIsActive(true);
    setStatus('connecting');
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      if (!outputAudioContextRef.current) {
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('listening');
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionRef.current?.sendRealtimeInput({ media: pcmBlob });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscriptions(prev => [...prev.slice(-4), `AI: ${message.serverContent?.outputTranscription?.text}`]);
            }
            if (message.serverContent?.inputTranscription) {
              setTranscriptions(prev => [...prev.slice(-4), `YOU: ${message.serverContent?.inputTranscription?.text}`]);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setStatus('rapping');
              const outCtx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
              const source = outCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outCtx.destination);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('listening');
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Session error:', e);
            stopSession();
          },
          onclose: () => {
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are an aggressive but playful freestyle battle rapper. React to the user raps with rhymes. Keep your responses short (2-4 lines) to maintain flow. Use modern slang and high energy.',
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      stopSession();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8 bg-zinc-900/50 rounded-3xl border border-white/10 h-full">
      <div className="relative">
        <div className={`w-48 h-48 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
          status === 'listening' ? 'border-green-500 glow-pulse' : 
          status === 'rapping' ? 'border-purple-500 animate-pulse' : 
          status === 'connecting' ? 'border-yellow-500 animate-spin-slow' : 'border-zinc-700'
        }`}>
          <div className={`w-36 h-36 rounded-full flex items-center justify-center bg-zinc-800 ${isActive ? 'scale-110' : 'scale-100'} transition-transform`}>
            <i className={`fas ${isActive ? 'fa-microphone' : 'fa-microphone-slash'} text-5xl ${isActive ? 'text-purple-400' : 'text-zinc-600'}`}></i>
          </div>
        </div>
        
        {isActive && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black px-4 py-1 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest text-purple-400">
            {status}
          </div>
        )}
      </div>

      <div className="w-full max-w-md space-y-4">
        <h3 className="text-center text-xl font-bold text-white uppercase tracking-wider">Live Cypher</h3>
        <div className="bg-black/60 rounded-xl p-4 h-48 overflow-y-auto border border-white/5 flex flex-col-reverse gap-2">
          {transcriptions.map((t, i) => (
            <div key={i} className={`text-sm ${t.startsWith('YOU') ? 'text-purple-300' : 'text-gray-400'}`}>
              {t}
            </div>
          ))}
          {transcriptions.length === 0 && (
            <div className="text-zinc-600 italic text-center text-sm py-12">
              Start the session and drop some bars...
            </div>
          )}
        </div>
      </div>

      <button
        onClick={isActive ? stopSession : startSession}
        className={`w-full max-w-xs py-4 rounded-2xl font-bungee text-xl transition-all ${
          isActive 
            ? 'bg-red-600/20 border border-red-500 text-red-500 hover:bg-red-600/30' 
            : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/40'
        }`}
      >
        {isActive ? 'STOP SESSION' : 'ENTER THE CYPHER'}
      </button>

      <div className="text-zinc-500 text-xs text-center flex items-center gap-2">
        <i className="fas fa-info-circle"></i>
        Requires microphone access for real-time interaction
      </div>
    </div>
  );
};
