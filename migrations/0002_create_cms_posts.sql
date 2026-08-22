CREATE TABLE cms_posts(id TEXT PRIMARY KEY,slug TEXT NOT NULL UNIQUE,title TEXT NOT NULL,description TEXT NOT NULL,category TEXT NOT NULL,content TEXT NOT NULL,author TEXT NOT NULL,image TEXT,status TEXT NOT NULL CHECK(status IN ('draft','published')),created_at TEXT NOT NULL,updated_at TEXT NOT NULL,published_at TEXT,CHECK((status='draft' AND published_at IS NULL) OR (status='published' AND published_at IS NOT NULL)));
INSERT INTO cms_posts SELECT id,slug,title,description,category,content,COALESCE(NULLIF(TRIM(author),''),'Greyce'),NULLIF(TRIM(image),''),'draft',created_at,updated_at,NULL FROM cms_drafts;
CREATE INDEX idx_cms_posts_admin ON cms_posts(status,updated_at DESC);
CREATE INDEX idx_cms_posts_public ON cms_posts(status,published_at DESC,slug);
