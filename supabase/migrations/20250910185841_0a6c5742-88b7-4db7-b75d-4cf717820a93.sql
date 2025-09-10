-- Fix user_security_settings table RLS policies for security
-- Drop existing insecure policies
DROP POLICY IF EXISTS "Users can view own security settings" ON public.user_security_settings;
DROP POLICY IF EXISTS "Users can insert own security settings" ON public.user_security_settings;  
DROP POLICY IF EXISTS "Users can update own security settings" ON public.user_security_settings;

-- Create secure policies that require authentication
-- Policy 1: Authenticated users can only view their own security settings
CREATE POLICY "authenticated_users_view_own_security_settings" 
ON public.user_security_settings 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

-- Policy 2: Authenticated users can only insert their own security settings
CREATE POLICY "authenticated_users_insert_own_security_settings" 
ON public.user_security_settings 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

-- Policy 3: Authenticated users can only update their own security settings  
CREATE POLICY "authenticated_users_update_own_security_settings" 
ON public.user_security_settings 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

-- Policy 4: Service role can manage all security settings (for system operations)
CREATE POLICY "service_role_manage_security_settings" 
ON public.user_security_settings 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Add performance indexes on security-critical columns
CREATE INDEX IF NOT EXISTS idx_user_security_settings_user_id ON public.user_security_settings(user_id);

-- Ensure user_id cannot be NULL (critical for security)
ALTER TABLE public.user_security_settings ALTER COLUMN user_id SET NOT NULL;