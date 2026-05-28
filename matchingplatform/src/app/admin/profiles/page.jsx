'use client';

import NavBar from '../../../components/navbar/page';
import AdminUsersManager from '../../../components/AdminUsersManager/AdminUsersManager';
import AdminProfilesManager from '../../../components/AdminProfilesManager/AdminProfilesManager';
import { useCurrentProfile } from '../../../hooks/useCurrentProfile';
import '../styles.css';

const navButtons = [
    { page: "Dashboard", path: "/admin", icon: "/home-icon.svg" },
    { page: "Profiles", path: "/admin/profiles", icon: "/profile-icon.svg" },
    { page: "Matching", path: "/matching", icon: "/matching-icon.svg" },
    { page: "Admin Profile", path: "/admin-profile", icon: "/profile-icon.svg" },
];

export default function AdminProfilesPage() {
    const currentProfile = useCurrentProfile();

    return (
        <div className="admin-page">
            <NavBar
                buttons={navButtons}
                profile="Admin"
                user={currentProfile?.full_name || currentProfile?.email || 'Admin'}
                email={currentProfile?.email || ''}
            />
            <main className="admin-main-content">
                <div className="admin-page-header">
                    <h1>Participant Profiles</h1>
                    <p>Manage aspiring and established professional matching information</p>
                </div>
                <AdminUsersManager />
                <AdminProfilesManager />
            </main>
        </div>
    );
}
