
import { GoogleGenAI, Type, Modality } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    'Missing VITE_GEMINI_API_KEY. Please add it to your .env.local file.\n' +
    'Get your API key from: https://ai.google.dev/'
  );
}

export const getGeminiChat = () => {
  const ai = new GoogleGenAI({ apiKey });
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are an elite freestyle battle rapper and lyrical consultant. 
      Your tone is confident, edgy, and highly creative. 
      When analyzing lyrics, look for internal rhyme, metaphor, and wordplay. 
      When battling, be sharp but keep it fun. Never use harmful language.`,
    },
  });
};

export const generateQuickRhymes = async (word: string) => {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite-latest',
    contents: `Find 10 high-quality rhymes and 3 related wordplay suggestions for: "${word}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          rhymes: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["word", "rhymes", "suggestions"],
      },
    },
  });
  return JSON.parse(response.text);
};

export const generateRapTTS = async (text: string, voice: 'Kore' | 'Puck' | 'Zephyr' = 'Kore') => {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Rap this with rhythm and attitude: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};
