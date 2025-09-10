-- Fix subscribers table RLS policies for security
-- First, drop existing problematic policies
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create secure policies that require authentication
-- Policy 1: Users can only view their own subscription data
CREATE POLICY "authenticated_users_view_own_subscription" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (
    (user_id IS NOT NULL AND auth.uid() = user_id) 
    OR 
    (auth.email() IS NOT NULL AND email = auth.email())
  )
);

-- Policy 2: Users can insert their own subscription data
CREATE POLICY "authenticated_users_insert_own_subscription" 
ON public.subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    (user_id IS NOT NULL AND auth.uid() = user_id)
    OR 
    (auth.email() IS NOT NULL AND email = auth.email())
  )
);

-- Policy 3: Users can update their own subscription data  
CREATE POLICY "authenticated_users_update_own_subscription" 
ON public.subscribers 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (
    (user_id IS NOT NULL AND auth.uid() = user_id)
    OR 
    (auth.email() IS NOT NULL AND email = auth.email())
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    (user_id IS NOT NULL AND auth.uid() = user_id)
    OR 
    (auth.email() IS NOT NULL AND email = auth.email())
  )
);

-- Policy 4: Service role can manage all subscription data (for system operations)
CREATE POLICY "service_role_full_access" 
ON public.subscribers 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Ensure the table has proper constraints
-- Make user_id NOT NULL to prevent security gaps (only if it makes sense for your app)
-- Note: Commenting this out as it might break existing data - evaluate if needed
-- ALTER TABLE public.subscribers ALTER COLUMN user_id SET NOT NULL;

-- Add index for better performance on security-critical columns
CREATE INDEX IF NOT EXISTS idx_subscribers_user_id ON public.subscribers(user_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_user_email ON public.subscribers(user_id, email);