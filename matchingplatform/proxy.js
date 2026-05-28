import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const ROLE_HOME = {
    admin: '/admin',
    aspiring: '/aspiring',
    established: '/established',
};

const PROTECTED_PREFIXES = [
    { prefix: '/admin', roles: ['admin'] },
    { prefix: '/admin-profile', roles: ['admin'] },
    { prefix: '/matching', roles: ['admin'] },
    { prefix: '/aspiring', roles: ['aspiring'] },
    { prefix: '/established', roles: ['established'] },
];

const AUTH_ROUTES = ['/login', '/signup'];

export async function proxy(request) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                response = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) => {
                    response.cookies.set(name, value, options);
                });
            },
        },
    });

    const pathname = request.nextUrl.pathname;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        const protectedRoute = getProtectedRoute(pathname);
        if (!protectedRoute) return response;

        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    const role = await getUserRole(supabase, user);

    if (AUTH_ROUTES.includes(pathname)) {
        const home = ROLE_HOME[role] || '/login';
        return NextResponse.redirect(new URL(home, request.url));
    }

    const protectedRoute = getProtectedRoute(pathname);
    if (!protectedRoute) return response;

    if (!protectedRoute.roles.includes(role)) {
        const home = ROLE_HOME[role] || '/login';
        return NextResponse.redirect(new URL(home, request.url));
    }

    return response;
}

function getProtectedRoute(pathname) {
    return PROTECTED_PREFIXES.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

async function getUserRole(supabase, user) {
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

    if (profile?.role === 'admin') return 'admin';
    return normalizeSignupRole(profile?.role || user.user_metadata?.role);
}

function normalizeSignupRole(role) {
    return role === 'established' ? 'established' : 'aspiring';
}

export const config = {
    matcher: [
        '/admin',
        '/admin/:path*',
        '/admin-profile',
        '/admin-profile/:path*',
        '/matching',
        '/matching/:path*',
        '/aspiring',
        '/aspiring/:path*',
        '/established',
        '/established/:path*',
        '/login',
        '/signup',
    ],
};
