'use client';
import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL = "https://lgmtapkhdwlgbkkcikqh.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_4sAAhPad80ZiCPNLiGQTvw_qQBmrSSq";

export function createSupabaseBrowserClient() {
    return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
