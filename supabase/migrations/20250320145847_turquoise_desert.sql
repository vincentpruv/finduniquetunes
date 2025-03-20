/*
  # Create videos table and security policies

  1. New Tables
    - `videos`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `author` (text)
      - `composer` (text)
      - `youtube_link` (text, required)
      - `tags` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `videos` table
    - Add policies for authenticated users to manage videos
*/

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text,
  composer text,
  youtube_link text NOT NULL,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view videos
CREATE POLICY "Anyone can view videos" 
  ON videos 
  FOR SELECT 
  USING (true);

-- Only authenticated users can insert videos
CREATE POLICY "Authenticated users can insert videos" 
  ON videos 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Only authenticated users can update videos
CREATE POLICY "Authenticated users can update videos" 
  ON videos 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Only authenticated users can delete videos
CREATE POLICY "Authenticated users can delete videos" 
  ON videos 
  FOR DELETE 
  TO authenticated 
  USING (true);