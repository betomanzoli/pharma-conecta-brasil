-- Create a sanitized public view exposing only non-sensitive profile fields
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  first_name,
  last_name,
  user_type,
  created_at,
  updated_at
FROM public.profiles;

-- Optional: add comment for documentation
COMMENT ON VIEW public.public_profiles IS 'Sanitized view of profiles exposing only non-sensitive fields (no email, phone, or LinkedIn).';