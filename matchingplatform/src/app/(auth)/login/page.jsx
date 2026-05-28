'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../../api/createClient';
import './styles.css';

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginFallback />}>
            <LoginForm />
        </Suspense>
    );
}

function LoginFallback() {
    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Log In</h1>
                <p className="auth-subtitle">Loading...</p>
            </div>
        </div>
    );
}

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const supabase = createClient();

        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .maybeSingle();

        const role = profile?.role || normalizePublicSignupRole(data.user.user_metadata?.role);
        const landing = getAllowedRedirect(searchParams.get('next'), role);
        router.push(landing);
        router.refresh();
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Log In</h1>
                <p className="auth-subtitle">Sign in to your Next For Autism account</p>

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="auth-field">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@email.com"
                        />
                    </div>

                    <div className="auth-field">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Your password"
                        />
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Log In'}
                    </button>
                </form>

                <p className="auth-switch">
                    Don&apos;t have an account? <Link href="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
}

function normalizePublicSignupRole(role) {
    return role === 'established' ? 'established' : 'aspiring';
}

function getAllowedRedirect(nextPath, role) {
    const landing = getLandingForRole(role);
    if (!nextPath || !nextPath.startsWith('/')) return landing;

    const allowedPrefixes = {
        admin: ['/admin', '/admin-profile', '/matching'],
        established: ['/established'],
        aspiring: ['/aspiring'],
    };

    const allowed = allowedPrefixes[role] || [];
    return allowed.some(prefix => nextPath === prefix || nextPath.startsWith(`${prefix}/`))
        ? nextPath
        : landing;
}

function getLandingForRole(role) {
    switch (role) {
        case 'admin': return '/admin';
        case 'established': return '/established';
        case 'aspiring': return '/aspiring';
        default: return '/login';
    }
}
