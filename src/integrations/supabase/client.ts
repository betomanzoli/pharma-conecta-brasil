// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://irjjksfhyiwsbsipeyrj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlyamprc2ZoeWl3c2JzaXBleXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzgzMzksImV4cCI6MjA2NTE1NDMzOX0.UxXPjqqCmrAfcKHr7lhQJEAOWt_9rJrf6qzn2rjtcwQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);