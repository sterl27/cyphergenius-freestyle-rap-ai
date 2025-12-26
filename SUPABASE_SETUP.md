# Supabase Integration for CypherGenius

This document explains how to set up and use Supabase with CypherGenius.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details:
   - **Name:** CypherGenius (or your preferred name)
   - **Database Password:** Choose a strong password
   - **Region:** Select closest to your users
4. Wait for project to be provisioned (~2 minutes)

### 2. Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xexzplnyzblfllucfvbwt.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 3. Update Environment Variables

Open `.env.local` and update:

```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the contents of `supabase_schema.sql` and paste it
4. Click **Run** to execute the SQL

This creates three tables:
- `lyric_sessions` - Stores Lyric Studio conversations
- `rap_battles` - Records Live Cypher sessions
- `rhyme_queries` - Caches rhyme finder results

### 5. Restart Your Dev Server

```bash
npm run dev
```

## Database Schema

### `lyric_sessions`

Stores collaborative lyric writing sessions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | TEXT | Optional user identifier |
| `title` | TEXT | Session title |
| `messages` | JSONB | Array of chat messages |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

**Example message format:**
```json
{
  "id": "msg_123",
  "role": "user",
  "text": "Check out these bars...",
  "timestamp": 1703606400000
}
```

### `rap_battles`

Records Live Cypher battle sessions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | TEXT | Optional user identifier |
| `transcription` | JSONB | Array of transcribed lines |
| `duration_seconds` | INTEGER | Battle duration |
| `created_at` | TIMESTAMP | Creation timestamp |

### `rhyme_queries`

Caches rhyme finder queries for quick access.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `word` | TEXT | The word to rhyme |
| `rhymes` | JSONB | Array of rhyme suggestions |
| `suggestions` | JSONB | Array of wordplay tips |
| `created_at` | TIMESTAMP | Creation timestamp |

## Usage Examples

### Saving a Lyric Session

```typescript
import { saveLyricSession } from './services/supabaseClient';

const session = {
  title: 'Battle Prep Session',
  messages: [
    { id: '1', role: 'user', text: 'Help me write...', timestamp: Date.now() },
    { id: '2', role: 'assistant', text: 'Here are some ideas...', timestamp: Date.now() }
  ]
};

const saved = await saveLyricSession(session);
console.log('Session saved:', saved.id);
```

### Loading All Sessions

```typescript
import { getLyricSessions } from './services/supabaseClient';

const sessions = await getLyricSessions();
console.log(`Found ${sessions.length} sessions`);
```

### Updating a Session

```typescript
import { updateLyricSession } from './services/supabaseClient';

await updateLyricSession('session-id', {
  messages: [...existingMessages, newMessage]
});
```

### Saving a Rap Battle

```typescript
import { saveRapBattle } from './services/supabaseClient';

const battle = {
  transcription: [
    'YOU: Started from the bottom...',
    'AI: Now I\'m at the top, can\'t stop...'
  ],
  duration_seconds: 120
};

await saveRapBattle(battle);
```

### Caching Rhyme Queries

```typescript
import { saveRhymeQuery } from './services/supabaseClient';

const result = await generateQuickRhymes('microphone');

// Cache for future use
await saveRhymeQuery({
  word: 'microphone',
  rhymes: result.rhymes,
  suggestions: result.suggestions
});
```

## Component Integration

### Updated LyricStudio Component

The component now supports both localStorage (fallback) and Supabase:

```typescript
// Option 1: Use Supabase
import { saveLyricSession, getLyricSessions } from '../services/supabaseClient';

// Option 2: Keep localStorage as fallback
// Current implementation already works, just add Supabase sync
```

### Migration Strategy

1. **Phase 1:** Keep localStorage as primary (current)
2. **Phase 2:** Add Supabase as optional sync (backup)
3. **Phase 3:** Make Supabase primary with localStorage fallback

## Security Considerations

### Current Setup (Development)

- **Row Level Security (RLS):** Enabled but with permissive policies
- **Anonymous access:** Allowed for testing
- **API keys:** Client-side (not production-ready)

### Production Recommendations

1. **Enable Supabase Auth:**
   ```typescript
   import { supabase } from './services/supabaseClient';
   
   // Sign up
   const { data, error } = await supabase.auth.signUp({
     email: 'user@example.com',
     password: 'password'
   });
   
   // Sign in
   await supabase.auth.signInWithPassword({
     email: 'user@example.com',
     password: 'password'
   });
   ```

2. **Update RLS Policies:**
   ```sql
   -- Replace permissive policies with user-specific ones
   CREATE POLICY "Users can read own sessions" ON lyric_sessions
     FOR SELECT USING (auth.uid()::text = user_id);
   ```

3. **Add Backend Proxy:**
   - Move sensitive operations to Vercel/Cloudflare Functions
   - Keep anon key client-side only for non-sensitive reads

## Features Enabled

### ✅ With Supabase Integration

- **Cloud sync:** Access sessions from any device
- **Persistent storage:** Never lose your lyrics
- **Battle history:** Review past cypher sessions
- **Rhyme cache:** Faster rhyme lookups
- **Analytics:** Track most popular words, session counts
- **Collaboration:** (Future) Share sessions with others

### 📊 Analytics Queries

```sql
-- Most popular rhyme words
SELECT word, COUNT(*) as count
FROM rhyme_queries
GROUP BY word
ORDER BY count DESC
LIMIT 10;

-- Total sessions per day
SELECT DATE(created_at) as date, COUNT(*) as sessions
FROM lyric_sessions
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Average battle duration
SELECT AVG(duration_seconds) as avg_duration
FROM rap_battles;
```

## Troubleshooting

### Error: "Missing Supabase environment variables"

- Check `.env.local` exists and has correct variables
- Restart dev server after adding variables
- Ensure variables start with `VITE_` prefix

### Error: "relation does not exist"

- Run the SQL schema in Supabase SQL Editor
- Check table names match exactly
- Verify you're connected to correct project

### RLS Policy Errors

- Temporarily disable RLS for testing:
  ```sql
  ALTER TABLE lyric_sessions DISABLE ROW LEVEL SECURITY;
  ```
- Check policy definitions in Supabase dashboard

### Connection Timeouts

- Verify Supabase URL is correct
- Check network connectivity
- Ensure project is not paused (free tier auto-pauses after inactivity)

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Configure environment variables
3. ✅ Run database schema
4. ⬜ Test database connection
5. ⬜ Integrate with LyricStudio component
6. ⬜ Add battle history viewer
7. ⬜ Implement user authentication (optional)

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Subscriptions](https://supabase.com/docs/guides/realtime)
