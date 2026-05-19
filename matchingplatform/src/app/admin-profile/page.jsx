'use client';
import { useState, useEffect } from 'react';
import NavBar from '../../components/navbar/page';
import { getRecentActivity } from '../../api/queries';
import { getCurrentProfileWithDetails } from '../../api/profile';
import './styles.css';

const navButtons = [
    { page: "Dashboard", path: "/admin", icon: "/home.png" },
    { page: "Profiles", path: "/admin/profiles", icon: "/profile.png" },
    { page: "Matching", path: "/matching", icon: "/globe.svg" },
    { page: "Admin Profile", path: "/admin-profile", icon: "/profile.png" },
];

function AdminProfilePage() {
    const [adminData, setAdminData] = useState(null);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [profile, recentActivity] = await Promise.all([
                    getCurrentProfileWithDetails(),
                    getRecentActivity(5),
                ]);
                setAdminData(profile?.profile || null);
                setActivity(recentActivity || []);
            } catch (err) {
                console.error('Failed to fetch admin profile:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const getInitials = (name) => name ? name.split(' ').map(w => w[0]).join('') : '?';

    function timeAgo(timestamp) {
        const now = new Date();
        const then = new Date(timestamp);
        const seconds = Math.floor((now - then) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }

    if (loading) {
        return (
            <div className="profile-page">
                <NavBar buttons={navButtons} profile="Admin" user="Admin User" email="admin@next.org" />
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
                user={adminData?.full_name || 'Admin User'}
                email={adminData?.email || 'admin@next.org'}
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
                {/* Recent Activity */}
                {activity.length > 0 && (
                    <div className="info-section">
                        <div className="info-section-header">
                            <h2>Recent Activity</h2>
                        </div>
                        <div className="activity-list">
                            {activity.map((item, index) => (
                                <div className="activity-row" key={index}>
                                    <div className="activity-info">
                                        <p className="activity-action">{item.action}</p>
                                        <p className="activity-detail">{item.detail}</p>
                                    </div>
                                    <span className="activity-time">{timeAgo(item.created_at)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminProfilePage;
