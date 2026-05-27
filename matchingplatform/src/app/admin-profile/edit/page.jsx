'use client';

import NavBar from '../../../components/navbar/page';
import ProfileEditor from '../../../components/ProfileEditor/ProfileEditor';
import { useCurrentProfile } from '../../../hooks/useCurrentProfile';

const navButtons = [
    { page: "Dashboard", path: "/admin", icon: "/home-icon.svg" },
    { page: "Profiles", path: "/admin/profiles", icon: "/profile-icon.svg" },
    { page: "Matching", path: "/matching", icon: "/matching-icon.svg" },
    { page: "Admin Profile", path: "/admin-profile", icon: "/profile-icon.svg" },
];

export default function AdminProfileEditPage() {
    const currentProfile = useCurrentProfile();

    return (
        <ProfileEditor
            expectedRole="admin"
            title="Admin Profile"
            nav={
                <NavBar
                    buttons={navButtons}
                    profile="Admin"
                    user={currentProfile?.full_name || currentProfile?.email || 'Admin'}
                    email={currentProfile?.email || ''}
                />
            }
        />
    );
}
