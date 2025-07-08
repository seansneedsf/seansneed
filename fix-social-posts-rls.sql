-- Fix RLS policies for social_posts table
-- This script will ensure that the social_posts table can be read by anonymous users

-- First, let's check the current state of the table
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    forcerlsexist
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE t.tablename = 'social_posts'
    AND n.nspname = 'public';

-- Show existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'social_posts';

-- Create or replace the SELECT policy to allow anonymous access
-- This allows anyone to read social posts (which is what we want for a public social feed)
DROP POLICY IF EXISTS "Enable read access for all users" ON social_posts;

CREATE POLICY "Enable read access for all users" 
ON social_posts FOR SELECT 
TO anon, authenticated 
USING (true);

-- Optional: If you want to restrict INSERT/UPDATE/DELETE to authenticated users only
-- Uncomment the following policies as needed:

-- DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON social_posts;
-- CREATE POLICY "Enable insert for authenticated users only" 
-- ON social_posts FOR INSERT 
-- TO authenticated 
-- WITH CHECK (true);

-- DROP POLICY IF EXISTS "Enable update for authenticated users only" ON social_posts;
-- CREATE POLICY "Enable update for authenticated users only" 
-- ON social_posts FOR UPDATE 
-- TO authenticated 
-- USING (true) 
-- WITH CHECK (true);

-- DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON social_posts;
-- CREATE POLICY "Enable delete for authenticated users only" 
-- ON social_posts FOR DELETE 
-- TO authenticated 
-- USING (true);

-- Verify the policies were created correctly
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'social_posts'; 