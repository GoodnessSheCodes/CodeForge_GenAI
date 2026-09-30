/*
# Create generations table (single-tenant, no auth)

1. New Tables
- `generations`
  - `id` (uuid, primary key)
  - `content_type` (text: "code" | "tutorial" | "blog")
  - `topic` (text, the user's request description)
  - `language` (text, programming language or technology, nullable)
  - `skill_level` (text: "beginner" | "intermediate" | "advanced")
  - `result` (text, the full generated markdown content)
  - `model` (text, the OpenAI model used)
  - `created_at` (timestamptz, defaults to now)
2. Security
- Enable RLS on `generations`.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (no sign-in screen in this app).
3. Notes
- Single-tenant app: no user_id column, no auth dependency.
- All generation history is visible to anyone using the app.
*/

CREATE TABLE IF NOT EXISTS generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('code', 'tutorial', 'blog')),
  topic text NOT NULL,
  language text,
  skill_level text NOT NULL DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  result text NOT NULL,
  model text NOT NULL DEFAULT 'gpt-4o-mini',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_generations" ON generations;
CREATE POLICY "anon_select_generations" ON generations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_generations" ON generations;
CREATE POLICY "anon_insert_generations" ON generations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_generations" ON generations;
CREATE POLICY "anon_update_generations" ON generations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_generations" ON generations;
CREATE POLICY "anon_delete_generations" ON generations FOR DELETE
  TO anon, authenticated USING (true);
