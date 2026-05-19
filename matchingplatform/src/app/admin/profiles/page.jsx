'use client';

import NavBar from '../../../components/navbar/page';
import AdminProfilesManager from '../../../components/AdminProfilesManager/AdminProfilesManager';
import '../styles.css';

const navButtons = [
    { page: "Dashboard", path: "/admin", icon: "/home.png" },
    { page: "Profiles", path: "/admin/profiles", icon: "/profile.png" },
    { page: "Matching", path: "/matching", icon: "/globe.svg" },
    { page: "Admin Profile", path: "/admin-profile", icon: "/profile.png" },
];

export default function AdminProfilesPage() {
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
                    <h1>Profiles</h1>
                    <p>Manage student and mentor matching information</p>
                </div>
                <AdminProfilesManager />
            </main>
        </div>
    );
}
