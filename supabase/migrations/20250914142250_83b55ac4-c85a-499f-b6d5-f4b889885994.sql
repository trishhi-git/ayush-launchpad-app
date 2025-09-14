-- Fix function search path security issues by updating existing functions

-- Update generate_application_id function with proper search_path
CREATE OR REPLACE FUNCTION public.generate_application_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  new_id TEXT;
  counter INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(application_id FROM 'AYU-2024-(\d+)') AS INTEGER)), 0) + 1
  INTO counter
  FROM public.applications;
  
  new_id := 'AYU-2024-' || LPAD(counter::TEXT, 6, '0');
  RETURN new_id;
END;
$function$;

-- Update update_updated_at_column function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update set_application_id function with proper search_path
CREATE OR REPLACE FUNCTION public.set_application_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.application_id IS NULL OR NEW.application_id = '' THEN
    NEW.application_id := generate_application_id();
  END IF;
  RETURN NEW;
END;
$function$;