'use client';
import { useState } from 'react';
import NavBar from '../../components/navbar/page';
import './styles.css';

const navButtons = [
    { page: "Dashboard", path: "/admin", icon: "/home.png"},
    { page: "Matching", path: "/matching", icon: "/globe.svg"},
    { page: "Admin Profile", path: "/admin-profile", icon: "/profile.png"},
];

const suggestedMatchesData = [
    {
        id: 1,
        aspiring: { name: "Jordan Smith", field: "Business", university: "Graduate" },
        established: { name: "Avery Davis", field: "Strategy", company: "JPM" },
        compatibility: 90,
        attributes: ["University", "Field", "Interests"],
    },
    {
        id: 2,
        aspiring: { name: "Riley Chen", field: "Engineering", university: "Caltech" },
        established: { name: "Parker Johnson", field: "Engineering", company: "Apple" },
        compatibility: 85,
        attributes: ["University", "Field"],
    },
    {
        id: 3,
        aspiring: { name: "Casey Park", field: "Computer Science", university: "Stanford" },
        established: { name: "Blair Brooks", field: "Computer Science", company: "Meta" },
        compatibility: 80,
        attributes: ["Field", "Interests"],
    },
    {
        id: 4,
        aspiring: { name: "Morgan Lee", field: "Psychology", university: "Cornell" },
        established: { name: "Adrian Taylor", field: "Mentoring", company: "Deloitte" },
        compatibility: 78,
        attributes: ["Interests", "Goals", "Career Focus"],
    },
];

const activeMatchesData = [
    {
        id: 1,
        aspiring: { name: "Alex Thompson", field: "Aspiring Professional" },
        established: { name: "Jordan Lee", field: "Established Professional" },
        week: 3,
        totalWeeks: 10,
        progress: 37,
        status: "New",
    },
    {
        id: 2,
        aspiring: { name: "Sam Rivera", field: "Aspiring Professional" },
        established: { name: "Casey Martinez", field: "Established Professional" },
        week: 5,
        totalWeeks: 10,
        progress: 56,
        status: "On track",
    },
    {
        id: 3,
        aspiring: { name: "Taylor Kim", field: "Aspiring Professional" },
        established: { name: "Morgan Chen", field: "Established Professional" },
        week: 8,
        totalWeeks: 10,
        progress: 89,
        status: "Excellent",
    },
];

const universities = ["All Universities", "Stanford", "Caltech", "Cornell", "MIT", "Berkeley"];

function MatchingPage() {
    const [selectedUniversity, setSelectedUniversity] = useState("All Universities");
    const [suggestedMatches, setSuggestedMatches] = useState(suggestedMatchesData);

    const handleApprove = (id) => {
        setSuggestedMatches(prev => prev.filter(m => m.id !== id));
    };

    const handleReject = (id) => {
        setSuggestedMatches(prev => prev.filter(m => m.id !== id));
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'New': return 'status-new';
            case 'On track': return 'status-ontrack';
            case 'Excellent': return 'status-excellent';
            default: return '';
        }
    };

    const getInitials = (name) => name.split(' ').map(w => w[0]).join('');

    return (
        <div className="matching-page">
            <NavBar
                buttons={navButtons}
                profile="Admin"
                user="Admin User"
                email="admin@next.org"
            />
            <main className="matching-main-content">
                {/* Header */}
                <div className="matching-header">
                    <h1>Matching</h1>
                    <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                {/* Suggested Matches */}
                <div className="matching-section">
                    <div className="section-header">
                        <span className="section-icon">✨</span>
                        <h2>Suggested Matches</h2>
                    </div>
                    <p className="section-subtitle">AI-generated mentee pairings awaiting your approval — based on field, university, and shared interests.</p>

                    <div className="suggested-matches-list">
                        {suggestedMatches.map((match) => (
                            <div className="suggested-match-row" key={match.id}>
                                <span className="match-number">{match.id}</span>

                                <div className="match-person">
                                    <div className="match-avatar aspiring-avatar">
                                        {getInitials(match.aspiring.name)}
                                    </div>
                                    <div className="match-person-info">
                                        <p className="match-person-name">{match.aspiring.name}</p>
                                        <p className="match-person-detail">{match.aspiring.field} · {match.aspiring.university}</p>
                                    </div>
                                </div>

                                <div className="compatibility-badge">
                                    <span className="compatibility-score">{match.compatibility}%</span>
                                    <span className="compatibility-label">Compatibility</span>
                                    <div className="compatibility-attributes">
                                        {match.attributes.map((attr, i) => (
                                            <span key={i} className="attribute-tag">{attr}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="match-person">
                                    <div className="match-avatar established-avatar">
                                        {getInitials(match.established.name)}
                                    </div>
                                    <div className="match-person-info">
                                        <p className="match-person-name">{match.established.name}</p>
                                        <p className="match-person-detail">{match.established.field} · {match.established.company}</p>
                                    </div>
                                </div>

                                <div className="match-actions">
                                    <button className="btn-reject" onClick={() => handleReject(match.id)}>✕</button>
                                    <button className="btn-approve" onClick={() => handleApprove(match.id)}>✓ Approve</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Matches */}
                <div className="matching-section">
                    <div className="section-header">
                        <h2>Active Matches ({activeMatchesData.length})</h2>
                    </div>
                    <p className="section-subtitle">Click any match to view curriculum progress.</p>

                    <div className="active-matches-list">
                        {activeMatchesData.map((match) => (
                            <div className="active-match-row" key={match.id}>
                                <div className="match-person">
                                    <div className="match-avatar aspiring-avatar">
                                        {getInitials(match.aspiring.name)}
                                    </div>
                                    <div className="match-person-info">
                                        <p className="match-person-name">{match.aspiring.name}</p>
                                        <p className="match-person-detail">{match.aspiring.field}</p>
                                    </div>
                                </div>

                                <div className="match-person">
                                    <div className="match-avatar established-avatar">
                                        {getInitials(match.established.name)}
                                    </div>
                                    <div className="match-person-info">
                                        <p className="match-person-name">{match.established.name}</p>
                                        <p className="match-person-detail">{match.established.field}</p>
                                    </div>
                                </div>

                                <div className="match-progress">
                                    <span className="progress-label">Week {match.week} of {match.totalWeeks}</span>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${match.progress}%` }}></div>
                                    </div>
                                </div>

                                <span className="progress-percent">{match.progress}%</span>

                                <span className={`match-status ${getStatusClass(match.status)}`}>
                                    {match.status}
                                </span>

                                <button className="btn-view-match">›</button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default MatchingPage;
