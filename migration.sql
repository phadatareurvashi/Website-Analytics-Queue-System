CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    path TEXT,
    user_id TEXT,
    timestamp TEXT,
    date TEXT
);
CREATE INDEX IF NOT EXISTS idx_events_site_date ON events(site_id, date);
CREATE INDEX IF NOT EXISTS idx_events_path ON events(path);
CREATE INDEX IF NOT EXISTS idx_events_user ON events(user_id);