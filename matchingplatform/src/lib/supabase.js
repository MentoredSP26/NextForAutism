import { createSupabaseBrowserClient } from './supabase-browser';

// Shared singleton browser client — authenticated session is automatically attached
export const supabase = createSupabaseBrowserClient();
