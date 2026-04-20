'use client';
import { useState, useEffect } from 'react';
import NavBar from '../../components/navbar/page';
import { getSuggestedMatches, getActiveMatches, getAspiringProfessionals, getEstablishedProfessionals, approveMatch, rejectMatch, createManualMatch } from '../../lib/queries';
import './styles.css';

const navButtons = [
    { page: "Dashboard", path: "/admin", icon: "/home.png" },
    { page: "Matching", path: "/matching", icon: "/globe.svg" },
    { page: "Admin Profile", path: "/admin-profile", icon: "/profile.png" },
];

const ADMIN_ID = 'ad000000-0000-0000-0000-000000000001';

function MatchingPage() {
    const [suggestedMatches, setSuggestedMatches] = useState([]);
    const [activeMatchesData, setActiveMatchesData] = useState([]);
    const [aspiringList, setAspiringList] = useState([]);
    const [establishedList, setEstablishedList] = useState([]);
    const [selectedAspiring, setSelectedAspiring] = useState('');
    const [selectedEstablished, setSelectedEstablished] = useState('');
    const [selectedUniversity, setSelectedUniversity] = useState('All Universities');
    const [loading, setLoading] = useState(true);

    async function fetchData() {
        try {
            const [suggested, active, aspiring, established] = await Promise.all([
                getSuggestedMatches(),
                getActiveMatches(),
                getAspiringProfessionals(),
                getEstablishedProfessionals(),
            ]);

            setSuggestedMatches(suggested.map((m, i) => ({
                id: m.id,
                number: i + 1,
                aspiring: {
                    name: m.aspiring?.full_name || '',
                    field: m.aspiring?.aspiring_professionals?.[0]?.major || '',
                    university: m.aspiring?.aspiring_professionals?.[0]?.university || '',
                },
                established: {
                    name: m.established?.full_name || '',
                    field: m.established?.established_professionals?.[0]?.field || '',
                    company: m.established?.established_professionals?.[0]?.company || '',
                },
                compatibility: m.compatibility_score,
                attributes: m.compatibility_attributes || [],
            })));

            setActiveMatchesData(active.map(m => {
                const progress = m.total_weeks > 0 ? Math.round((m.current_week / m.total_weeks) * 100) : 0;
                let status = 'New';
                if (progress >= 70) status = 'Excellent';
                else if (progress >= 40) status = 'On track';
                return {
                    id: m.id,
                    aspiring: { name: m.aspiring?.full_name || '', field: 'Aspiring Professional' },
                    established: { name: m.established?.full_name || '', field: 'Established Professional' },
                    week: m.current_week,
                    totalWeeks: m.total_weeks,
                    progress,
                    status,
                };
            }));

            setAspiringList(aspiring.map(p => ({ id: p.id, name: p.full_name, university: p.aspiring_professionals?.[0]?.university || '' })));
            setEstablishedList(established.map(p => ({ id: p.id, name: p.full_name })));
        } catch (err) {
            console.error('Failed to fetch matching data:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchData(); }, []);

    const handleApprove = async (id) => {
        try {
            await approveMatch(id, ADMIN_ID);
            setSuggestedMatches(prev => prev.filter(m => m.id !== id));
            fetchData();
        } catch (err) {
            console.error('Failed to approve match:', err);
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectMatch(id);
            setSuggestedMatches(prev => prev.filter(m => m.id !== id));
        } catch (err) {
            console.error('Failed to reject match:', err);
        }
    };

    const handleCreateMatch = async () => {
        if (!selectedAspiring || !selectedEstablished) return;
        try {
            await createManualMatch(selectedAspiring, selectedEstablished, ADMIN_ID);
            setSelectedAspiring('');
            setSelectedEstablished('');
            fetchData();
        } catch (err) {
            console.error('Failed to create match:', err);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'New': return 'status-new';
            case 'On track': return 'status-ontrack';
            case 'Excellent': return 'status-excellent';
            default: return '';
        }
    };

    const getInitials = (name) => name ? name.split(' ').map(w => w[0]).join('') : '?';

    const universities = ['All Universities', ...new Set(aspiringList.map(a => a.university).filter(Boolean))];

    const filteredAspiring = selectedUniversity === 'All Universities'
        ? aspiringList
        : aspiringList.filter(a => a.university === selectedUniversity);

    return (
        <div className="matching-page">
            <NavBar
                buttons={navButtons}
                profile="Admin"
                user="Admin User"
                email="admin@next.org"
            />
            <main className="matching-main-content">
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
                        {loading ? <p style={{padding: '12px', color: '#536077'}}>Loading...</p> :
                            suggestedMatches.length === 0 ? <p style={{padding: '12px', color: '#536077'}}>No suggested matches.</p> :
                            suggestedMatches.map((match) => (
                            <div className="suggested-match-row" key={match.id}>
                                <span className="match-number">{match.number}</span>

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
                        {loading ? <p style={{padding: '12px', color: '#536077'}}>Loading...</p> :
                            activeMatchesData.length === 0 ? <p style={{padding: '12px', color: '#536077'}}>No active matches.</p> :
                            activeMatchesData.map((match) => (
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

                {/* Create Match Manually */}
                <div className="matching-section">
                    <div className="section-header">
                        <h2>Create Match Manually</h2>
                    </div>

                    <div className="manual-match-form">
                        <div className="form-group">
                            <label>Filter by University</label>
                            <select
                                value={selectedUniversity}
                                onChange={(e) => setSelectedUniversity(e.target.value)}
                                className="form-select"
                            >
                                {universities.map((u, i) => (
                                    <option key={i} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Aspiring Professional</label>
                                <select
                                    className="form-select"
                                    value={selectedAspiring}
                                    onChange={(e) => setSelectedAspiring(e.target.value)}
                                >
                                    <option value="">Choose aspiring professional</option>
                                    {filteredAspiring.map(a => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Established Professional</label>
                                <select
                                    className="form-select"
                                    value={selectedEstablished}
                                    onChange={(e) => setSelectedEstablished(e.target.value)}
                                >
                                    <option value="">Choose established professional</option>
                                    {establishedList.map(e => (
                                        <option key={e.id} value={e.id}>{e.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button className="btn-create-match" onClick={handleCreateMatch}>✓ Create Match</button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default MatchingPage;
