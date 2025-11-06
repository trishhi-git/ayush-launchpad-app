-- Complete admin access fix
-- Run this in your Supabase SQL Editor

-- Disable RLS for admin operations (temporary fix)
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with proper admin policies
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Applications policies
CREATE POLICY "Users can view own applications" ON applications
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own applications" ON applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON applications
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin can view all applications" ON applications
    FOR ALL USING (auth.email() = 'abc@gmail.com');

-- Documents policies
CREATE POLICY "Users can view own documents" ON documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM applications 
            WHERE applications.id = documents.application_id 
            AND applications.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert own documents" ON documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM applications 
            WHERE applications.id = documents.application_id 
            AND applications.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update own documents" ON documents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM applications 
            WHERE applications.id = documents.application_id 
            AND applications.user_id = auth.uid()
        )
    );
CREATE POLICY "Admin can manage all documents" ON documents
    FOR ALL USING (auth.email() = 'abc@gmail.com');

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role can insert profiles" ON profiles
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view all profiles" ON profiles
    FOR ALL USING (auth.email() = 'abc@gmail.com');

-- Activity logs policies
CREATE POLICY "Users can view own activity logs" ON activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM applications 
            WHERE applications.id = activity_logs.application_id 
            AND applications.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert activity logs" ON activity_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM applications 
            WHERE applications.id = activity_logs.application_id 
            AND applications.user_id = auth.uid()
        )
    );
CREATE POLICY "Admin can manage all activity logs" ON activity_logs
    FOR ALL USING (auth.email() = 'abc@gmail.com');