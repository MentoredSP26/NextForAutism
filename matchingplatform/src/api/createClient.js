import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = "https://lgmtapkhdwlgbkkcikqh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnbXRhcGtoZHdsZ2Jra2Npa3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTg4NzksImV4cCI6MjA5MTg5NDg3OX0.WK_-4yQgX46sdTWgcxm0VahPNUE7l01fpAuEHm2YJbc";

export const createClient = () =>
  createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
