-- Admin functions for bypassing RLS
-- Run this in your Supabase SQL Editor

-- Function to get all documents for admin (bypasses RLS)
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
        'full_name', p.full_name,
        'email', p.email
      )
    ) as applications
  FROM documents d
  JOIN applications a ON d.application_id = a.id
  JOIN profiles p ON a.user_id = p.user_id
  WHERE d.file_path IS NOT NULL
  ORDER BY d.uploaded_at DESC;
END;
$$;

-- Grant execute permission to authenticated users (admin check can be added later)
GRANT EXECUTE ON FUNCTION get_all_documents_admin() TO authenticated;

-- Add admin policies for documents table
CREATE POLICY "Admins can view all documents" ON documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.email = 'abc@gmail.com'
        )
    );

CREATE POLICY "Admins can update all documents" ON documents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.email = 'abc@gmail.com'
        )
    );