'use client';
import { useState, useEffect } from 'react';
import NavBar from '../../components/navbar/page';
import { getCurrentProfileWithDetails } from '../../api/profile';
import './styles.css';

const navButtons = [
    { page: "Dashboard", path: "/admin", icon: "/home-icon.svg" },
    { page: "Profiles", path: "/admin/profiles", icon: "/profile-icon.svg" },
    { page: "Matching", path: "/matching", icon: "/matching-icon.svg" },
    { page: "Admin Profile", path: "/admin-profile", icon: "/profile-icon.svg" },
];

function AdminProfilePage() {
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const profile = await getCurrentProfileWithDetails();
                setAdminData(profile?.profile || null);
            } catch (err) {
                console.error('Failed to fetch admin profile:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const getInitials = (name) => name ? name.split(' ').map(w => w[0]).join('') : '?';

    if (loading) {
        return (
            <div className="profile-page">
                <NavBar buttons={navButtons} profile="Admin" user="Admin" email="" />
                <main className="profile-main-content">
                    <p style={{padding: '32px', color: '#536077'}}>Loading...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <NavBar
                buttons={navButtons}
                profile="Admin"
                user={adminData?.full_name || adminData?.email || 'Admin'}
                email={adminData?.email || ''}
            />
            <main className="profile-main-content">
                <div className="profile-header">
                    <h1>Admin Profile</h1>
                    <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="profile-card">
                    <div className="profile-card-top">
                        <div className="profile-card-left">
                            <div className="profile-avatar">{getInitials(adminData?.full_name)}</div>
                            <div className="profile-identity">
                                <h2 className="profile-name">{adminData?.full_name}</h2>
                                <div className="profile-badges">
                                    <span className="badge-role">{adminData?.role}</span>
                                    <span className="badge-status">
                                        <span className="status-dot"></span>
                                        {adminData?.activity_status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <a className="btn-edit-profile" href="/admin-profile/edit">Edit Profile</a>
                    </div>
                    {adminData?.bio && <p className="profile-bio">{adminData.bio}</p>}
                </div>
            </main>
        </div>
    );
}

export default AdminProfilePage;
