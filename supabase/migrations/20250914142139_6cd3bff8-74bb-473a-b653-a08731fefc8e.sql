-- Add Aadhaar fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN aadhaar_number TEXT,
ADD COLUMN aadhaar_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN aadhaar_verified_at TIMESTAMP WITH TIME ZONE;

-- Create index for Aadhaar number lookups
CREATE INDEX idx_profiles_aadhaar ON public.profiles(aadhaar_number) WHERE aadhaar_number IS NOT NULL;

-- Create table for OTP verification
CREATE TABLE public.aadhaar_otp_verification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aadhaar_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on OTP verification table
ALTER TABLE public.aadhaar_otp_verification ENABLE ROW LEVEL SECURITY;

-- Allow users to insert and read their own OTP records
CREATE POLICY "Users can insert OTP verification requests" 
ON public.aadhaar_otp_verification 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can read their own OTP verification requests" 
ON public.aadhaar_otp_verification 
FOR SELECT 
USING (true);