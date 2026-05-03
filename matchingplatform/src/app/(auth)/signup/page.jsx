'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../../api/createClient';
import './styles.css';

export default function SignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('aspiring');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const supabase = createClient();

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                },
            },
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        if (authData.session) {
            router.push(getLandingForRole(role));
            router.refresh();
        } else {
            setMessage('Check your email to confirm your account, then log in.');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Sign Up</h1>
                <p className="auth-subtitle">Create your Next For Autism account</p>

                <form onSubmit={handleSignup} className="auth-form">
                    <div className="auth-field">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder="Jane Doe"
                        />
                    </div>

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
                            minLength={6}
                            placeholder="At least 6 characters"
                        />
                    </div>

                    <div className="auth-field">
                        <label>I am signing up as</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} required>
                            <option value="aspiring">Aspiring Professional (Student)</option>
                            <option value="established">Established Professional (Mentor)</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {error && <div className="auth-error">{error}</div>}
                    {message && <div className="auth-success">{message}</div>}

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link href="/login">Log in</Link>
                </p>
            </div>
        </div>
    );
}

function getLandingForRole(role) {
    switch (role) {
        case 'admin': return '/admin';
        case 'established': return '/established';
        case 'aspiring': return '/aspiring';
        default: return '/';
    }
}
