'use client';

import NavBar from '../../../components/navbar/page';
import ProfileEditor from '../../../components/ProfileEditor/ProfileEditor';

const navButtons = [
    { page: "Dashboard", path: "/admin", icon: "/home.png" },
    { page: "Profiles", path: "/admin/profiles", icon: "/profile.png" },
    { page: "Matching", path: "/matching", icon: "/globe.svg" },
    { page: "Admin Profile", path: "/admin-profile", icon: "/profile.png" },
];

export default function AdminProfileEditPage() {
    return (
        <ProfileEditor
            expectedRole="admin"
            title="Admin Profile"
            nav={<NavBar buttons={navButtons} profile="Admin" user="Admin Profile" email="Edit details" />}
        />
    );
}
