import NavBar from '../../components/navbar/page';
import './styles.css';

const navButtons = [
    { page: "Dashboard", path: "/admin" },
    { page: "Matching", path: "/matching" },
    { page: "Admin Profile", path: "/admin-profile" },
];

const adminData = {
    name: "Bob Chen",
    initials: "BC",
    role: "Head Manager",
    status: "Available",
    bio: "Experienced program administrator with 10+ years in mentorship coordination and student development.",
    email: "bobchen@email.com",
    phone: "+1(555) 123-4567",
    location: "San Francisco, CA",
    joinDate: "January 2024",
    position: "Head Manager",
    university: "Berkeley",
    department: "Student Services",
    capacity: "n",
};

const recentActivity = [
    { action: "Created match", detail: "Alex & Jordan", time: "2h ago" },
    { action: "Updated settings", detail: "Email notifications", time: "1d ago" },
    { action: "Reviewed reports", detail: "Q1 Analytics", time: "3d ago" },
];

function AdminProfilePage() {
    return (
        <div className="profile-page">
            <NavBar
                buttons={navButtons}
                profile="Admin"
                user="Admin User"
                email="admin@next.org"
            />
            <main className="profile-main-content">
                {/* Header */}
                <div className="profile-header">
                    <h1>Admin Profile</h1>
                    <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                {/* Profile Card */}
                <div className="profile-card">
                    <div className="profile-card-top">
                        <div className="profile-card-left">
                            <div className="profile-avatar">{adminData.initials}</div>
                            <div className="profile-identity">
                                <h2 className="profile-name">{adminData.name}</h2>
                                <div className="profile-badges">
                                    <span className="badge-role">{adminData.role}</span>
                                    <span className="badge-status">
                                        <span className="status-dot"></span>
                                        {adminData.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button className="btn-edit-profile">Edit Profile</button>
                    </div>
                    <p className="profile-bio">{adminData.bio}</p>
                </div>

                {/* Contact & Information */}
                <div className="info-section">
                    <div className="info-section-header">
                        <h2>Contact & Information</h2>
                    </div>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-icon">📧</span>
                            <div>
                                <p className="info-label">Email Address</p>
                                <p className="info-value">{adminData.email}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <span className="info-icon"></span>
                            <div>
                                <p className="info-label">Position</p>
                                <p className="info-value">{adminData.position}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <span className="info-icon"></span>
                            <div>
                                <p className="info-label">Phone Number</p>
                                <p className="info-value">{adminData.phone}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <span className="info-icon"></span>
                            <div>
                                <p className="info-label">University</p>
                                <p className="info-value">{adminData.university}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <span className="info-icon"></span>
                            <div>
                                <p className="info-label">Location</p>
                                <p className="info-value">{adminData.location}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <span className="info-icon"></span>
                            <div>
                                <p className="info-label">Department</p>
                                <p className="info-value">{adminData.department}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <span className="info-icon"></span>
                            <div>
                                <p className="info-label">Join Date</p>
                                <p className="info-value">{adminData.joinDate}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <span className="info-icon"></span>
                            <div>
                                <p className="info-label">Capacity</p>
                                <p className="info-value">{adminData.capacity}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="info-section">
                    <div className="info-section-header">
                        <h2>Recent Activity</h2>
                    </div>
                    <div className="activity-list">
                        {recentActivity.map((item, index) => (
                            <div className="activity-row" key={index}>
                                <div className="activity-info">
                                    <p className="activity-action">{item.action}</p>
                                    <p className="activity-detail">{item.detail}</p>
                                </div>
                                <span className="activity-time">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminProfilePage;
