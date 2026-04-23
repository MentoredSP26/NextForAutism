import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/signup', '/'];

// Map each role to the route prefix it's allowed to access
const ROLE_ROUTES = {
    admin: ['/admin', '/admin-profile', '/matching'],
    established: ['/established'],
    aspiring: ['/aspiring'],
};

export async function middleware(request) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    response = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // IMPORTANT: this refreshes the session cookie — required for session persistence
    const { data: { user } } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;
    const isPublic = PUBLIC_ROUTES.some(p => pathname === p);

    // Not logged in → redirect to login (unless on a public route)
    if (!user && !isPublic) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Logged in and trying to visit /login or /signup → send to their landing
    if (user && (pathname === '/login' || pathname === '/signup')) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        const landing = getLandingForRole(profile?.role);
        return NextResponse.redirect(new URL(landing, request.url));
    }

    // Role-based route protection
    if (user && !isPublic) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const role = profile?.role;
        const allowed = ROLE_ROUTES[role] || [];
        const isAllowed = allowed.some(prefix => pathname.startsWith(prefix));

        if (!isAllowed) {
            // Kick them to their own landing page
            return NextResponse.redirect(new URL(getLandingForRole(role), request.url));
        }
    }

    return response;
}

function getLandingForRole(role) {
    switch (role) {
        case 'admin': return '/admin';
        case 'established': return '/established';
        case 'aspiring': return '/aspiring';
        default: return '/login';
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static, _next/image (Next internals)
         * - favicon, images, svgs in public
         * - api routes
         */
        '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
