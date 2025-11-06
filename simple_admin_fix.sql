-- Simple admin access fix
-- Run this in your Supabase SQL Editor

-- Add admin policies only (skip if they already exist)
CREATE POLICY "Admin can view all applications" ON applications
    FOR ALL USING (auth.email() = 'abc@gmail.com');

CREATE POLICY "Admin can manage all documents" ON documents
    FOR ALL USING (auth.email() = 'abc@gmail.com');

CREATE POLICY "Admin can view all profiles" ON profiles
    FOR ALL USING (auth.email() = 'abc@gmail.com');

CREATE POLICY "Admin can manage all activity logs" ON activity_logs
    FOR ALL USING (auth.email() = 'abc@gmail.com');