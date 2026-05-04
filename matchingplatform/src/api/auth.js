'use client';
import { createSupabaseBrowserClient } from './supabase-browser';


// signout 
export async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
}


// get current user
export async function getCurrentUser() {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return { ...user, profile };
}
