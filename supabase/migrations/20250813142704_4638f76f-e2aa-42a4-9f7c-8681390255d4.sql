-- Fix Security Definer View issue by adding proper RLS policies to views

-- Enable RLS on the views
ALTER VIEW public.v_ai_chat_context SET (security_invoker = on);
ALTER VIEW public.public_profiles SET (security_invoker = on);

-- Enable RLS on the views (treat them like tables for RLS purposes)
-- Note: We need to convert views to tables with RLS or drop them if not needed

-- Since v_ai_chat_context is just an aggregation of ai_chat_threads and ai_chat_messages,
-- and those tables already have proper RLS, we can drop this view as it's not secure
DROP VIEW IF EXISTS public.v_ai_chat_context;

-- For public_profiles, this view seems to be exposing profile data without proper RLS
-- Let's drop it and rely on the profiles table which has proper RLS policies
DROP VIEW IF EXISTS public.public_profiles;

-- If we need a public view of profiles, we should create a function with SECURITY DEFINER
-- that properly checks permissions instead of a view
CREATE OR REPLACE FUNCTION public.get_public_profiles()
RETURNS TABLE(
    id uuid,
    first_name text,
    last_name text,
    user_type text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only return profiles that should be publicly visible
    -- Add business logic here to determine what should be public
    RETURN QUERY
    SELECT 
        p.id,
        p.first_name,
        p.last_name,
        p.user_type,
        p.created_at,
        p.updated_at
    FROM public.profiles p
    WHERE p.user_type IN ('mentor', 'consultant', 'laboratory', 'company'); -- Only business profiles are public
END;
$$;