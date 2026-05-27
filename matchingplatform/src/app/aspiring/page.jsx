'use client';
import { useState, useEffect } from 'react';
import { createClient } from '../../api/createClient';
import NavBar from '../../components/navbar/page';
import './styles.css';

const navButtons = [
    { page: "Dashboard", path: "/aspiring", icon: "/home-icon.svg" },
    { page: "Profile", path: "/aspiring/profile", icon: "/profile-icon.svg" },
];

export default function AspiringPage() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUser(user);

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(profileData);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="aspiring-page">
                <NavBar buttons={navButtons} profile="Aspiring" user="..." email="..." />
                <main className="aspiring-main">
                    <p style={{ padding: '32px', color: '#536077' }}>Loading...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="aspiring-page">
            <NavBar
                buttons={navButtons}
                profile="Aspiring"
                user={profile?.full_name || user?.email || ''}
                email={profile?.email || user?.email || ''}
            />
            <main className="aspiring-main">
                <div className="aspiring-header">
                    <h1>Welcome, {profile?.full_name?.split(' ')[0] || 'there'}!</h1>
                    <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="aspiring-cards">
                    <div className="aspiring-card">
                        <div className="card-icon">🎓</div>
                        <h3>Your Mentor</h3>
                        <p className="card-value">
                            {profile?.is_matched ? 'Matched' : 'Not yet matched'}
                        </p>
                        <p className="card-sub">
                            {profile?.is_matched
                                ? 'Your mentor has been assigned'
                                : 'An admin will match you with a mentor soon'}
                        </p>
                    </div>

                    <div className="aspiring-card">
                        <div className="card-icon">📋</div>
                        <h3>Status</h3>
                        <p className="card-value" style={{ textTransform: 'capitalize' }}>
                            {profile?.activity_status || 'Available'}
                        </p>
                        <p className="card-sub">Your current activity status</p>
                    </div>

                    <div className="aspiring-card">
                        <div className="card-icon">📅</div>
                        <h3>Program</h3>
                        <p className="card-value">Next For Autism</p>
                        <p className="card-sub">Mentorship program</p>
                    </div>
                </div>

                <div className="aspiring-section">
                    <h2>Getting Started</h2>
                    <div className="steps-list">
                        <div className="step-item">
                            <span className="step-num">1</span>
                            <div>
                                <p className="step-title">Complete your profile</p>
                                <p className="step-desc">Add your university, major, and interests so we can find the best mentor for you.</p>
                            </div>
                        </div>
                        <div className="step-item">
                            <span className="step-num">2</span>
                            <div>
                                <p className="step-title">Wait for your match</p>
                                <p className="step-desc">An admin will review your profile and match you with an established professional.</p>
                            </div>
                        </div>
                        <div className="step-item">
                            <span className="step-num">3</span>
                            <div>
                                <p className="step-title">Start your mentorship</p>
                                <p className="step-desc">Once matched, you&apos;ll begin the weekly curriculum with your mentor.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
