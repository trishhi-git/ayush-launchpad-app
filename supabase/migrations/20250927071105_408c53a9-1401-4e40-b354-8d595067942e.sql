-- Add foreign key relationship between applications and profiles
ALTER TABLE public.applications 
ADD CONSTRAINT fk_applications_user_profiles 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Also update the applications table to allow investors to view approved startups
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;

CREATE POLICY "Users can view their own applications" 
ON public.applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Investors can view approved applications seeking funding" 
ON public.applications 
FOR SELECT 
USING (status = 'approved' AND is_seeking_funding = true);

-- Allow investors to view startup profiles
CREATE POLICY "Investors can view startup profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.applications 
    WHERE applications.user_id = profiles.user_id 
    AND applications.status = 'approved' 
    AND applications.is_seeking_funding = true
  )
);