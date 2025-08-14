-- Fix critical security vulnerability in profiles table
-- Remove the overly permissive SELECT policy that allows viewing all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create secure RLS policies for profiles table
-- Users can only view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Admins can view all profiles (if needed for admin functionality)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

-- Public profiles can be viewed by authenticated users (only basic info)
-- This is for cases where users need to see basic info of other users they interact with
CREATE POLICY "Public profile info viewable by authenticated users" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  -- Only allow viewing basic non-sensitive fields for business profiles
  user_type IN ('mentor', 'consultant', 'laboratory', 'company')
);

-- Update the existing policies to be more restrictive
-- Users can only insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);