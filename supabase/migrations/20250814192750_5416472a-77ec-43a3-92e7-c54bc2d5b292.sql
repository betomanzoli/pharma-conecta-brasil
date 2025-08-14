-- Fix critical security vulnerability in subscribers table RLS policies

-- Drop the overly permissive update policy
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create a secure update policy that only allows users to update their own subscription
CREATE POLICY "update_own_subscription" ON public.subscribers
  FOR UPDATE
  USING (auth.uid() = user_id OR auth.email() = email)
  WITH CHECK (auth.uid() = user_id OR auth.email() = email);

-- Drop and recreate the insert policy to be more restrictive
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- Create a secure insert policy that only allows authenticated users to insert their own subscription
CREATE POLICY "insert_subscription" ON public.subscribers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.email() = email);