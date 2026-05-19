'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../../api/createClient';
import { saveSignupProfile } from '../../../api/profile';
import './styles.css';

export default function SignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('aspiring');
    const [aspiringDetails, setAspiringDetails] = useState({
        university: '',
        major: '',
        field_of_interest: '',
        graduation_year: '',
        goals: '',
    });
    const [establishedDetails, setEstablishedDetails] = useState({
        company: '',
        job_title: '',
        field: '',
        years_experience: '',
        mentoring_capacity: '',
        university: '',
    });
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
                    profile_details: role === 'aspiring' ? aspiringDetails : establishedDetails,
                },
            },
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        if (authData.user && authData.session) {
            try {
                await saveSignupProfile(
                    supabase,
                    authData.user.id,
                    role,
                    {
                        email,
                        full_name: fullName,
                        activity_status: 'available',
                    },
                    role === 'aspiring' ? aspiringDetails : establishedDetails
                );
            } catch (profileError) {
                setError(profileError.message);
                setLoading(false);
                return;
            }
        }

        if (authData.session) {
            router.push(getLandingForRole(role));
            router.refresh();
        } else {
            setMessage('Check your email to confirm your account, then log in. Your profile details were saved as signup metadata and may need review after first login.');
        }
        setLoading(false);
    };

    const updateAspiringDetails = (field, value) => {
        setAspiringDetails(prev => ({ ...prev, [field]: value }));
    };

    const updateEstablishedDetails = (field, value) => {
        setEstablishedDetails(prev => ({ ...prev, [field]: value }));
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

                    {role === 'aspiring' && (
                        <div className="auth-fieldset">
                            <h2>Student Profile</h2>
                            <div className="auth-field">
                                <label>University</label>
                                <input
                                    type="text"
                                    value={aspiringDetails.university}
                                    onChange={(e) => updateAspiringDetails('university', e.target.value)}
                                    required
                                    placeholder="University or program"
                                />
                            </div>
                            <div className="auth-field">
                                <label>Major</label>
                                <input
                                    type="text"
                                    value={aspiringDetails.major}
                                    onChange={(e) => updateAspiringDetails('major', e.target.value)}
                                    required
                                    placeholder="Business, Design, Computer Science"
                                />
                            </div>
                            <div className="auth-field">
                                <label>Field of Interest</label>
                                <input
                                    type="text"
                                    value={aspiringDetails.field_of_interest}
                                    onChange={(e) => updateAspiringDetails('field_of_interest', e.target.value)}
                                    required
                                    placeholder="Strategy, UX Design, Software Engineering"
                                />
                            </div>
                            <div className="auth-field">
                                <label>Graduation Year</label>
                                <input
                                    type="number"
                                    min="2020"
                                    max="2040"
                                    value={aspiringDetails.graduation_year}
                                    onChange={(e) => updateAspiringDetails('graduation_year', e.target.value)}
                                    placeholder="2026"
                                />
                            </div>
                            <div className="auth-field">
                                <label>Goals / Preferences</label>
                                <textarea
                                    value={aspiringDetails.goals}
                                    onChange={(e) => updateAspiringDetails('goals', e.target.value)}
                                    placeholder="What kind of mentor or career support would help most?"
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    {role === 'established' && (
                        <div className="auth-fieldset">
                            <h2>Mentor Profile</h2>
                            <div className="auth-field">
                                <label>Company</label>
                                <input
                                    type="text"
                                    value={establishedDetails.company}
                                    onChange={(e) => updateEstablishedDetails('company', e.target.value)}
                                    required
                                    placeholder="Company or organization"
                                />
                            </div>
                            <div className="auth-field">
                                <label>Job Title</label>
                                <input
                                    type="text"
                                    value={establishedDetails.job_title}
                                    onChange={(e) => updateEstablishedDetails('job_title', e.target.value)}
                                    required
                                    placeholder="Software Engineer, Designer, Manager"
                                />
                            </div>
                            <div className="auth-field">
                                <label>Mentoring Field</label>
                                <input
                                    type="text"
                                    value={establishedDetails.field}
                                    onChange={(e) => updateEstablishedDetails('field', e.target.value)}
                                    required
                                    placeholder="Computer Science, Marketing, Finance"
                                />
                            </div>
                            <div className="auth-field">
                                <label>University</label>
                                <input
                                    type="text"
                                    value={establishedDetails.university}
                                    onChange={(e) => updateEstablishedDetails('university', e.target.value)}
                                    placeholder="Optional alma mater"
                                />
                            </div>
                            <div className="auth-field auth-grid">
                                <div>
                                    <label>Years Experience</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="80"
                                        value={establishedDetails.years_experience}
                                        onChange={(e) => updateEstablishedDetails('years_experience', e.target.value)}
                                        placeholder="5"
                                    />
                                </div>
                                <div>
                                    <label>Mentoring Capacity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={establishedDetails.mentoring_capacity}
                                        onChange={(e) => updateEstablishedDetails('mentoring_capacity', e.target.value)}
                                        placeholder="2"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

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
