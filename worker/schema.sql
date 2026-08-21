-- Esquema del foro (D1 / SQLite)
-- Aplicar con:
--   npx wrangler d1 execute foro-luces --file=./schema.sql --remote
--   npx wrangler d1 execute foro-luces --file=./schema.sql --local

CREATE TABLE IF NOT EXISTS posts (
	id TEXT PRIMARY KEY,
	parent_id TEXT,
	name TEXT NOT NULL,
	avatar_url TEXT,
	content TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	FOREIGN KEY (parent_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_posts_parent ON posts(parent_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);

CREATE TABLE IF NOT EXISTS attachments (
	id TEXT PRIMARY KEY,
	post_id TEXT NOT NULL,
	type TEXT NOT NULL, -- 'image' | 'audio'
	url TEXT NOT NULL,
	FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_attachments_post ON attachments(post_id);
