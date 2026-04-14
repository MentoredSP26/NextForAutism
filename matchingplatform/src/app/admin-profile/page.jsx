import NavBar from '../../components/navbar/page';
import './styles.css';

const navButtons = [
    { page: "Dashboard", path: "/admin", icon: "/home.png"},
    { page: "Matching", path: "/matching", icon: "/globe.svg"},
    { page: "Admin Profile", path: "/admin-profile", icon: "/profile.png" },
];

const adminData = {
    name: "Bob Chen",
    initials: "BC",
    role: "Head Manager",
    status: "Available",
    bio: "Experienced program administrator with",
};

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
            </main>
        </div>
    );
}

export default AdminProfilePage;
