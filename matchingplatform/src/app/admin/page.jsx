import ActivityFeed from './components/ActivityFeed/ActivityFeed';
import PersonRow from './components/PersonRow/PersonRow';
import StatsCard from './components/StatsCard/StatsCard';
import './styles.css';

const stats = [
    { icon: "👥", label: "Total Aspiring", value: "9" },
    { icon: "💼", label: "Total Established", value: "8" },
    { icon: "🤝", label: "Total Matched", value: "3" },
    { icon: "⏳", label: "Total Unmatched", value: "6" },
];
const recentActivity = [
    { action: "New match created", user: "Alice Johnson and Bob Smith", time: "2 hours ago" },
    { action: "Profile updated", user: "Charlie Davis", time: "5 hours ago" },
    { action: "New aspiring professional registered", user: "Emily Clark", time: "1 day ago" },
    { action: "Curriculum week completed", user: "Frank Miller", time: "3 days ago" }
];
const aspiringProfessionals = [
    { name: "Alice Johnson", major: "Computer Science", university: "University A", isMatched: true },
    { name: "Charlie Davis", major: "Business Administration", university: "University B", isMatched: false },
    { name: "Emily Clark", major: "Psychology", university: "University C", isMatched: false },
];
const establishedProfessionals = [
    { name: "Bob Smith", major: "Software Engineering", university: "Tech Company X", isMatched: true },
    { name: "Frank Miller", major: "Marketing", university: "Company Y", isMatched: false },
];
function AdminPage() {
    return (
        <div className = "admin-page">
            <main className = "admin-main-content">
                {/* Page */}
                <div className = "admin-page-header">
                    <h1>Dashboard Overview</h1>
                    <p>{new Date().toLocaleDateString()}</p>
                </div>
                {/* Stats row */}
                <div className = "stats-row">
                    {stats.map((stat, index) => (
                        <StatsCard 
                        key={index}
                        icon={stat.icon}
                        label={stat.label}
                        value={stat.value}
                        />
                    ))}
                </div>
                {/* Recent Activity */}
                <div className = "roster-section">
                    {/* Aspiring Professionals */}
                    <div className = "roster-column">
                        <h3>Aspiring Professionals</h3>
                        {aspiringProfessionals.map((person, index) => (
                            <PersonRow
                            key={index}
                            name={person.name}
                            major = {person.major}
                            university={person.university}
                            isMatched = {person.isMatched}
                            />
                        ))}
                    </div>
                    {/* Established Professionals */}
                    <div className = "roster-column">
                        <h3>Established Professionals</h3>
                        {establishedProfessionals.map((person, index) => (
                            <PersonRow
                            key={index}
                            name={person.name}
                            major = {person.major}
                            university = {person.university}
                            isMatched = {person.isMatched}
                            />
                        ))}
                    </div>
                </div>
            </main>
            </div>
    );
}
export default AdminPage;