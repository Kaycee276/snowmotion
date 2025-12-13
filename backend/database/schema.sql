-- Game sessions table
CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_hash TEXT UNIQUE NOT NULL,
    player_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_used BOOLEAN DEFAULT FALSE,
    score INTEGER,
    difficulty INTEGER,
    submitted_at TIMESTAMP WITH TIME ZONE
);

-- Index for faster lookups
CREATE INDEX idx_game_sessions_hash ON game_sessions(game_hash);
CREATE INDEX idx_game_sessions_player ON game_sessions(player_address);