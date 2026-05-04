'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Select from 'react-select';
import { createClient } from '../../../api/createClient';
import './styles.css';
import universities from "../../us_institutions.json";

export default function SignupPage() {
    const router = useRouter();

    // UI State
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('aspiring');
    const [field_of_interest, setFieldOfInterest] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [universityInput, setUniversityInput] = useState('');

    // Fix for Next.js Hydration
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const loadUniversityOptions = (inputValue) => {
        const query = inputValue?.trim().toLowerCase();
        if (!query || query.length < 2) return [];

        return universities
            .filter((u) => u.institution.toLowerCase().includes(query))
            .slice(0, 15)
            .map((u) => ({
                value: u.institution,
                label: u.institution,
            }));
    };

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
                    university: selectedUniversity,
                    field_of_interest: field_of_interest,
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

    // Prevent rendering on server to avoid hydration mismatch
    if (!isMounted) return null;

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
                        <label>University</label>
                        <Select
                            options={loadUniversityOptions(universityInput)}
                            onInputChange={(val) => setUniversityInput(val)}
                            onChange={(option) => setSelectedUniversity(option?.value || null)}
                            placeholder="Search university..."
                            className="react-select-container"
                            classNamePrefix="react-select"
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                control: (base) => ({
                                    ...base,
                                    borderRadius: '8px',
                                    padding: '2px',
                                    borderColor: '#ddd',
                                }),
                            }}
                        />
                    </div>

                    <div className="auth-field">
                        <label>Field of Interest (Multi-Select)</label>
                        <select
                            multiple
                            className="multi-select"
                            value={field_of_interest}
                            onChange={(e) => {
                                const values = Array.from(
                                    e.target.selectedOptions,
                                    (option) => option.value
                                );
                                setFieldOfInterest(values);
                            }}
                        >
                            <option value="tech">Technology & Computing</option>
                            <option value="business">Business & Entrepreneurship</option>
                            <option value="social">Social Sciences & Society</option>
                            <option value="arts">Arts, Design & Media</option>
                            <option value="health">Health & Human Wellbeing</option>
                            <option value="law">Law, Policy & Public Impact</option>
                            <option value="environment">Natural World & Environment</option>
                            <option value="education">Education & Human Development</option>
                        </select>
                    </div>

                    <div className="auth-field">
                        <label>I am signing up as</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} required>
                            <option value="aspiring">Aspiring Professional (Student)</option>
                            <option value="established">Established Professional (Mentor)</option>
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
        case 'established': return '/established';
        case 'aspiring': return '/aspiring';
        default: return '/';
    }
}