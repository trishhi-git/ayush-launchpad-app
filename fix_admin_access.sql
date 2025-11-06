-- Fix admin access to see all documents
-- Run this in your Supabase SQL Editor

-- Add admin policies that bypass RLS for the hardcoded admin email
CREATE POLICY "Admin can view all documents" ON documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'abc@gmail.com'
        )
    );

CREATE POLICY "Admin can update all documents" ON documents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'abc@gmail.com'
        )
    );

-- Add admin policies for applications table
CREATE POLICY "Admin can view all applications" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'abc@gmail.com'
        )
    );

-- Add admin policies for profiles table
CREATE POLICY "Admin can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'abc@gmail.com'
        )
    );

-- Update the admin function to work without profiles table dependency
CREATE OR REPLACE FUNCTION get_all_documents_admin()
RETURNS TABLE (
  id UUID,
  application_id UUID,
  name TEXT,
  file_path TEXT,
  file_size BIGINT,
  mime_type TEXT,
  status TEXT,
  verification_status TEXT,
  verification_notes TEXT,
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  uploaded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  applications JSONB
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.application_id,
    d.name,
    d.file_path,
    d.file_size,
    d.mime_type,
    d.status,
    d.verification_status,
    d.verification_notes,
    d.verified_by,
    d.verified_at,
    d.uploaded_at,
    d.created_at,
    jsonb_build_object(
      'id', a.id,
      'company_name', a.company_name,
      'application_id', a.application_id,
      'ayush_category', a.ayush_category,
      'profiles', jsonb_build_object(
        'full_name', COALESCE(p.full_name, u.email),
        'email', COALESCE(p.email, u.email)
      )
    ) as applications
  FROM documents d
  JOIN applications a ON d.application_id = a.id
  JOIN auth.users u ON a.user_id = u.id
  LEFT JOIN profiles p ON a.user_id = p.user_id
  WHERE d.file_path IS NOT NULL
  ORDER BY d.uploaded_at DESC;
END;
$$;