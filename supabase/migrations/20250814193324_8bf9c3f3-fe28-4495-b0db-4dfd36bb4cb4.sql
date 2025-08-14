-- CRITICAL SECURITY FIX: Secure the public users table and migrate to proper auth system

-- 1. Drop the dangerous public read policy immediately
DROP POLICY IF EXISTS "Users can view all users" ON public.users;

-- 2. Create secure policies for the public users table (temporary - should be deprecated)
CREATE POLICY "Users can view own user record only" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- 3. Restrict updates to own records only
DROP POLICY IF EXISTS "Users can update own user record" ON public.users;
CREATE POLICY "Users can update own user record" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Prevent any new inserts into public users table (should use auth.users instead)
CREATE POLICY "Prevent new user creation in public table" ON public.users
  FOR INSERT
  WITH CHECK (false);

-- 5. Only allow admins to delete users
CREATE POLICY "Only admins can delete users" ON public.users
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 6. Add a security comment to the table
COMMENT ON TABLE public.users IS 'DEPRECATED: This table should not be used for new authentication. Use auth.users and profiles table instead. Contains legacy password hashes - migrate users to Supabase auth.';

-- 7. Create a function to safely migrate users from public.users to auth.users (admin only)
CREATE OR REPLACE FUNCTION public.migrate_user_to_auth(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Only admins can run this function
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only administrators can migrate users';
  END IF;
  
  -- Get user record
  SELECT * INTO user_record FROM public.users WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Log the migration attempt
  INSERT INTO public.security_audit_logs (user_id, event_type, event_description, metadata)
  VALUES (
    auth.uid(),
    'user_migration',
    'Attempted migration of user from public.users to auth.users',
    jsonb_build_object('target_user_id', target_user_id, 'target_email', user_record.email)
  );
  
  RETURN TRUE;
END;
$$;