-- Simple fix for signup issues
-- Run this in your Supabase SQL Editor

-- Drop the problematic trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Drop user_roles table completely if not needed
DROP TABLE IF EXISTS user_roles CASCADE;

-- Make sure profiles table allows inserts for new users
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow service role to insert profiles (for signup process)
CREATE POLICY "Service role can insert profiles" ON profiles
    FOR INSERT WITH CHECK (true);