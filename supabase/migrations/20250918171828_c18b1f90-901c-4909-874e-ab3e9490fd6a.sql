-- Create admin verification workflow
-- Add verification fields to documents table if not exists
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS verification_notes TEXT,
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'under_review'));

-- Create document verification logs table
CREATE TABLE IF NOT EXISTS public.document_verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
  notes TEXT,
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on verification logs
ALTER TABLE public.document_verification_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for verification logs
CREATE POLICY "Users can view verification logs for their documents"
  ON public.document_verification_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.documents d
    JOIN public.applications a ON d.application_id = a.id
    WHERE d.id = document_verification_logs.document_id
    AND a.user_id = auth.uid()
  ));

-- Admin policy for verification logs (will need admin role system)
CREATE POLICY "Admins can manage all verification logs"
  ON public.document_verification_logs FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to update document status
CREATE OR REPLACE FUNCTION public.update_document_verification_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the main documents table
  UPDATE public.documents 
  SET 
    verification_status = NEW.status,
    verification_notes = NEW.notes,
    verified_by = NEW.verified_by,
    verified_at = CASE WHEN NEW.status = 'approved' THEN now() ELSE NULL END
  WHERE id = NEW.document_id;
  
  -- Log activity
  INSERT INTO public.activity_logs (application_id, type, message, created_by)
  SELECT 
    d.application_id,
    'document_verification',
    'Document "' || d.name || '" ' || NEW.status || 
    CASE WHEN NEW.notes IS NOT NULL THEN ': ' || NEW.notes ELSE '' END,
    NEW.verified_by
  FROM public.documents d
  WHERE d.id = NEW.document_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger for verification status updates
DROP TRIGGER IF EXISTS update_document_status_trigger ON public.document_verification_logs;
CREATE TRIGGER update_document_status_trigger
  AFTER INSERT ON public.document_verification_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_document_verification_status();