<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🎤 CypherGenius - Freestyle Rap AI

**The AI-powered freestyle battle companion for rappers and lyricists**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5-purple.svg)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green.svg)](https://supabase.com/)

[View in AI Studio](https://ai.studio/apps/drive/1OgeV2NVc24GJNyWiy5HB7nj6s8-aYQD0)

</div>

---

## 📖 About

CypherGenius is an interactive web application that brings AI-powered freestyle rap capabilities to your browser. Built with React, TypeScript, and Google's Gemini AI, it offers multiple modes for rappers and lyricists to practice, create, and improve their craft.

## ✨ Features

### 🎙️ **Live Cypher Mode**
- Real-time voice interaction with AI battle rapper
- Bidirectional audio streaming with low latency
- Live transcription of both user and AI responses
- AI responds with dynamic freestyle bars

### ✍️ **Lyric Studio**
- Chat-based interface for lyric writing and refinement
- Get feedback on your bars from an AI lyrical consultant
- Cloud sync with Supabase for cross-device access
- Auto-save functionality with localStorage fallback
- Export your session as a text file
- Session history and management
- Get theme suggestions and battle ideas

### ⚡ **Quick Rhyme Finder**
- Instant rhyme generation for any word
- Perfect and near rhymes with phonetic matching
- Wordplay suggestions for creative punchlines
- Structured JSON output for consistent results

### 🎵 **Rap Playback (TTS)**
- Text-to-speech with rap-style delivery
- Paste your lyrics and hear them performed
- Multiple voice options:
  - Gemini voices: Kore, Puck, Zephyr
  - ElevenLabs voices: High-quality, customizable voices
- Dual TTS engine support (Gemini + ElevenLabs)

## 🛠️ Tech Stack

- **Frontend:** React 19.2 + TypeScript 5.8
- **Build Tool:** Vite 6.2
- **Database:** Supabase (PostgreSQL)
- **AI Models:** 
  - Gemini 2.5 Flash (Live Audio)
  - Gemini 2.5 Pro (Chat)
  - Gemini 2.5 Flash Lite (Rhyme Generation)
  - Gemini 2.5 Flash Preview (TTS)
  - ElevenLabs API (Premium TTS)
- **Styling:** Tailwind CSS + Custom Neon Theme
- **Audio:** Web Audio API for real-time processing
- **Icons:** Font Awesome 6.4

## 📁 Project Structure

```
cyphergenius_-freestyle-rap-ai/
├── components/
│   ├── Header.tsx              # App header with branding
│   ├── LiveRapSession.tsx      # Real-time audio cypher mode
│   ├── LyricStudio.tsx         # Chat-based lyric writing
│   ├── QuickRhyme.tsx          # Instant rhyme finder
│   └── TTSRapper.tsx           # Text-to-speech rap playback
├── services/
│   ├── geminiService.ts        # Gemini AI API integration
│   └── supabaseClient.ts       # Supabase database client
├── utils/
│   └── audio.ts                # Audio encoding/decoding utilities
├── App.tsx                     # Main app component & routing
├── index.tsx                   # React entry point
├── types.ts                    # TypeScript type definitions
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── supabase_schema.sql         # Database schema
├── SUPABASE_SETUP.md           # Supabase setup guide
├── TECHNICAL_PAPER.md          # Technical documentation
└── package.json                # Dependencies & scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (with npm)
- **Gemini API Key** from [Google AI Studio](https://ai.google.dev/)
- **Supabase Account** (optional) from [Supabase](https://supabase.com/) for cloud sync
- **ElevenLabs API Key** (optional) from [ElevenLabs](https://elevenlabs.io/) for premium TTS
- Modern web browser with microphone access (for Live Cypher mode)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cyphergenius_-freestyle-rap-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```bash
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_SUPABASE_URL=your_supabase_url_here              # Optional
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here    # Optional
   VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here  # Optional
   ```
   
   > 🔑 Get your Gemini API key from [Google AI Studio](https://ai.google.dev/)
   > 
   > 🔑 Get your Supabase credentials from [Supabase Dashboard](https://app.supabase.com/) (optional, for cloud sync)
   > 
   > 🔑 Get your ElevenLabs API key from [ElevenLabs](https://elevenlabs.io/) (optional, for enhanced TTS)
   
   **For Supabase setup:** See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed instructions.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## ☁️ Optional: Supabase Cloud Sync

Enable cloud storage for your sessions:

1. Create a free [Supabase](https://supabase.com) account
2. Follow the setup guide in [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
3. Add Supabase credentials to `.env.local`
4. Run the SQL schema from `supabase_schema.sql`

**Benefits:**
- 💾 Never lose your lyrics
- 🔄 Sync across devices
- 📊 View session history
- 🎯 Battle analytics
- 🚀 Faster rhyme lookups with cache

## 🎮 Usage Guide

### Live Cypher Mode
1. Click "ENTER THE CYPHER" button
2. Allow microphone access when prompted
3. Wait for "LISTENING" status
4. Start rapping - the AI will respond with freestyle bars
5. Click "STOP SESSION" to end

### Lyric Studio
1. Navigate to "LYRIC STUDIO" tab
2. Type your lyrics or ask for help
3. AI provides feedback and suggestions
4. Sessions auto-save to cloud (if Supabase configured)
5. Use "Export" to download your session
6. Use "Clear" to start fresh (with confirmation)

### Quick Rhyme
1. Enter a word in the input field
2. Click "GET" to generate rhymes
3. View perfect rhymes and wordplay tips

### Rap Playback
1. Paste or type your lyrics
2. Select voice engine (Gemini or ElevenLabs)
3. Click "RAP IT BACK"
4. Listen to AI perform your bars

## ⚠️ Known Issues & Limitations

- **API Key Security:** Currently client-side only. Consider backend proxy for production.
- **Browser Compatibility:** Live Cypher requires modern browsers with Web Audio API support
- **Microphone Access:** Must grant permissions for real-time features
- **ScriptProcessorNode:** Uses deprecated API (migration to AudioWorklet planned)
- **Rate Limits:** Subject to Gemini API quotas and limits

## 🔧 Troubleshooting

### "API Key not configured" error
- Ensure `.env.local` exists in root directory
- Verify `VITE_GEMINI_API_KEY` is set correctly
- If using ElevenLabs, verify `VITE_ELEVENLABS_API_KEY` is set
- Restart dev server after creating `.env.local`

### Microphone not working
- Check browser permissions (chrome://settings/content/microphone)
- Ensure no other app is using the microphone
- Try refreshing the page

### Audio playback issues
- Verify browser supports Web Audio API
- Check system audio settings
- Try different browser (Chrome/Edge recommended)

### Build errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Ensure Node.js version is 18+

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Migration to AudioWorklet API
- Backend proxy for API key security
- Unit tests with Vitest
- Accessibility improvements (ARIA labels, keyboard navigation)
- Mobile UI optimizations
- Error boundary components

## 📄 License

This project is part of Google AI Studio. Check the original project for license details.

## 🔗 Links

- [Google AI Studio](https://ai.studio/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Supabase](https://supabase.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [ElevenLabs](https://elevenlabs.io/)
- [ElevenLabs API Documentation](https://elevenlabs.io/docs)
- [View App in AI Studio](https://ai.studio/apps/drive/1OgeV2NVc24GJNyWiy5HB7nj6s8-aYQD0)
- [Technical Paper](TECHNICAL_PAPER.md)
- [Supabase Setup Guide](SUPABASE_SETUP.md)

## 🙏 Acknowledgments

- Powered by Google Gemini AI
- Cloud storage by Supabase
- Premium TTS by ElevenLabs
- Built with React + Vite
- Styled with Tailwind CSS
- Icons by Font Awesome

---

<div align="center">
<strong>Drop some bars. Get some feedback. Level up your flow. 🔥</strong>
</div>
