CREATE TABLE cms_drafts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  image TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status = 'draft'),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);