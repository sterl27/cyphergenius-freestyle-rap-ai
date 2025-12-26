
export enum AppMode {
  LIVE_CYPHER = 'LIVE_CYPHER',
  LYRIC_STUDIO = 'LYRIC_STUDIO',
  QUICK_RHYME = 'QUICK_RHYME',
  TTS_RAP = 'TTS_RAP'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export interface RhymeResponse {
  word: string;
  rhymes: string[];
  suggestions: string[];
}
