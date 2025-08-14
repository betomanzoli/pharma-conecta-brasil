-- Create a comprehensive role-based access control system for security audit logs

-- 1. Create an enum for application roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. Create user_roles table to manage user permissions
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    assigned_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Create convenience function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role)
$$;

-- 5. Create RLS policies for user_roles table
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 6. Update security_audit_logs RLS policies to include admin access
DROP POLICY IF EXISTS "Users can view own security audit logs" ON public.security_audit_logs;

-- Create new comprehensive policy for viewing security audit logs
CREATE POLICY "Users can view own audit logs and admins can view all" ON public.security_audit_logs
  FOR SELECT
  USING (
    auth.uid() = user_id OR 
    public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Ensure system can still insert audit logs
-- (existing policy "System can insert security audit logs" remains unchanged)

-- 7. Create policy to prevent unauthorized updates/deletes of audit logs
CREATE POLICY "Only admins can delete audit logs" ON public.security_audit_logs
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Prevent any updates to audit logs (immutable for integrity)
CREATE POLICY "Audit logs are immutable" ON public.security_audit_logs
  FOR UPDATE
  USING (false);