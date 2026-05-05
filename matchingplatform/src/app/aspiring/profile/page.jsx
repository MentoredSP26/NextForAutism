'use client';
import { useState, useEffect } from 'react';
import { createClient } from '../../../api/createClient';
import NavBar from '../../../components/navbar/page';
import Profile from "../../../components/Profile/Profile.jsx";
import { getAspiringProfessionalByID, getActiveMatches } from '../../../api/queries';
import './styles.css';

const navButtons = [
    { page: "Dashboard", path: "/aspiring", icon: "/home.png" },
    { page: "Aspiring Profile", path: "/aspiring/profile", icon: "/profile.png" },
];

function AspiringProfilePage() {
    const [profile, setProfile] = useState(null);
    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch the aspiring user's profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*, aspiring_professionals(*)')
                .eq('id', user.id)
                .single();
            setProfile(profileData);

            // Fetch their active match to find mentor
            const { data: matchData } = await supabase
                .from('matches')
                .select(`
                    *,
                    established:established_id(
                        id, full_name,
                        established_professionals(company, job_title, field)
                    )
                `)
                .eq('aspiring_id', user.id)
                .eq('status', 'active')
                .single();

            if (matchData?.established) {
                const ep = matchData.established.established_professionals;
                setMentor({
                    name: matchData.established.full_name,
                    role: ep?.job_title,
                    company: ep?.company,
                    expertise: ep?.field ? [ep.field] : [],
                });
            }

            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return <div className="aspiring-page"><p style={{ padding: 32 }}>Loading...</p></div>;

    return (
        <div className="aspiring-page">
            <NavBar buttons={navButtons} profile="Aspiring" user={profile?.full_name} email={profile?.email} />
            <div className="asp-profile-content">
                <Profile
                    name={profile?.full_name}
                    title="Aspiring Professional"
                    interests={profile?.aspiring_professionals?.field_of_interest
                        ? [profile.aspiring_professionals.field_of_interest]
                        : []}
                    email={profile?.email}
                    location={profile?.aspiring_professionals?.university}
                    joinedDate={`Joined ${new Date(profile?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
                    careerGoals={profile?.aspiring_professionals?.major}
                    mentor={mentor}
                />
            </div>
        </div>
    );
}

export default AspiringProfilePage;