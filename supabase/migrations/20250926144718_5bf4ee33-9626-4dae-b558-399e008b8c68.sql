-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('startup', 'admin', 'investor');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create funding_requests table for investor functionality
CREATE TABLE public.funding_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    investor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    equity_percentage DECIMAL(5,2),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
    message TEXT,
    terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for funding_requests
ALTER TABLE public.funding_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for funding_requests
CREATE POLICY "Startups can view funding requests for their applications"
ON public.funding_requests
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.applications 
        WHERE applications.id = funding_requests.application_id 
        AND applications.user_id = auth.uid()
    )
);

CREATE POLICY "Investors can view their own funding requests"
ON public.funding_requests
FOR SELECT
USING (auth.uid() = investor_id);

CREATE POLICY "Investors can create funding requests"
ON public.funding_requests
FOR INSERT
WITH CHECK (auth.uid() = investor_id AND public.has_role(auth.uid(), 'investor'));

CREATE POLICY "Investors can update their own funding requests"
ON public.funding_requests
FOR UPDATE
USING (auth.uid() = investor_id);

-- Admins can manage all funding requests
CREATE POLICY "Admins can manage all funding requests"
ON public.funding_requests
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for funding_requests updated_at
CREATE TRIGGER update_funding_requests_updated_at
    BEFORE UPDATE ON public.funding_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Update applications table to include funding information
ALTER TABLE public.applications 
ADD COLUMN funding_goal DECIMAL(15,2),
ADD COLUMN equity_offered DECIMAL(5,2),
ADD COLUMN funding_raised DECIMAL(15,2) DEFAULT 0,
ADD COLUMN is_seeking_funding BOOLEAN DEFAULT FALSE;

-- Update profiles table with role-specific fields
ALTER TABLE public.profiles
ADD COLUMN company_name TEXT,
ADD COLUMN investment_capacity DECIMAL(15,2),
ADD COLUMN investment_focus TEXT,
ADD COLUMN admin_level TEXT CHECK (admin_level IN ('super_admin', 'document_verifier', 'funding_admin'));

-- Create indexes for better performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_funding_requests_application_id ON public.funding_requests(application_id);
CREATE INDEX idx_funding_requests_investor_id ON public.funding_requests(investor_id);
CREATE INDEX idx_applications_seeking_funding ON public.applications(is_seeking_funding) WHERE is_seeking_funding = TRUE;