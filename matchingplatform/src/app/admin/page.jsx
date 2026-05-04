'use client';
import { useState, useEffect } from 'react';
import ActivityFeed from '../../components/ActivityFeed/ActivityFeed';
import PersonRow from '../../components/PersonRow/PersonRow';
import StatsCard from '../../components/StatsCard/StatsCard';
import NavBar from '../../components/navbar/page';
import { getDashboardStats, getAspiringProfessionals, getEstablishedProfessionals, getRecentActivity } from '../../api/queries';
import './styles.css';

const navButtons = [
    { page: "Dashboard", path: "/admin", icon: "/home.png" },
    { page: "Matching", path: "/matching", icon: "/globe.svg" },
    { page: "Admin Profile", path: "/admin-profile", icon: "/profile.png" },
];

function AdminPage() {
    const [stats, setStats] = useState([
        { icon: "👥", label: "Total Aspiring", value: "..." },
        { icon: "💼", label: "Total Established", value: "..." },
        { icon: "🤝", label: "Total Matched", value: "..." },
        { icon: "⏳", label: "Total Unmatched", value: "..." },
    ]);
    const [aspiringProfessionals, setAspiringProfessionals] = useState([]);
    const [establishedProfessionals, setEstablishedProfessionals] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [dashStats, aspiring, established, activity] = await Promise.all([
                    getDashboardStats(),
                    getAspiringProfessionals(),
                    getEstablishedProfessionals(),
                    getRecentActivity(),
                ]);

                setStats([
                    { icon: "👥", label: "Total Aspiring", value: String(dashStats.totalAspiring) },
                    { icon: "💼", label: "Total Established", value: String(dashStats.totalEstablished) },
                    { icon: "🤝", label: "Total Matched", value: String(dashStats.totalMatched) },
                    { icon: "⏳", label: "Total Unmatched", value: String(dashStats.totalUnmatched) },
                ]);

                setAspiringProfessionals(aspiring.map(p => ({
                    name: p.full_name,
                    major: p.aspiring_professionals?.[0]?.major || '',
                    university: p.aspiring_professionals?.[0]?.university || '',
                    isMatched: p.is_matched,
                })));

                setEstablishedProfessionals(established.map(p => ({
                    name: p.full_name,
                    major: p.established_professionals?.[0]?.field || '',
                    university: p.established_professionals?.[0]?.company || '',
                    isMatched: p.is_matched,
                })));

                setRecentActivity((activity || []).map(a => ({
                    action: a.action,
                    user: a.detail || '',
                    time: timeAgo(a.created_at),
                })));
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="admin-page">
            <NavBar
                buttons={navButtons}
                profile="Admin"
                user="Admin User"
                email="admin@next.org"
            />
            <main className="admin-main-content">
                <div className="admin-page-header">
                    <h1>Dashboard Overview</h1>
                    <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="stats-row">
                    {stats.map((stat, index) => (
                        <StatsCard
                            key={index}
                            icon={stat.icon}
                            label={stat.label}
                            value={stat.value}
                        />
                    ))}
                </div>
                <div className="roster-section">
                    <div className="roster-column">
                        <h3>Aspiring Professionals</h3>
                        {loading ? <p style={{padding: '12px', color: '#536077'}}>Loading...</p> :
                            aspiringProfessionals.map((person, index) => (
                                <PersonRow
                                    key={index}
                                    name={person.name}
                                    major={person.major}
                                    university={person.university}
                                    isMatched={person.isMatched}
                                />
                            ))
                        }
                    </div>
                    <div className="roster-column">
                        <h3>Established Professionals</h3>
                        {loading ? <p style={{padding: '12px', color: '#536077'}}>Loading...</p> :
                            establishedProfessionals.map((person, index) => (
                                <PersonRow
                                    key={index}
                                    name={person.name}
                                    major={person.major}
                                    university={person.university}
                                    isMatched={person.isMatched}
                                />
                            ))
                        }
                    </div>
                </div>
                <div className="activity-feed-wrapper">
                    <ActivityFeed activities={recentActivity} />
                </div>
            </main>
        </div>
    );
}

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

export default AdminPage;
