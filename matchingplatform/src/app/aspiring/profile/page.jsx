'use client';

import NavBar from '../../../components/navbar/page';
import ProfileEditor from '../../../components/ProfileEditor/ProfileEditor';

const navButtons = [
    { page: "Dashboard", path: "/aspiring", icon: "/home.png" },
    { page: "Profile", path: "/aspiring/profile", icon: "/profile.png" },
];

export default function AspiringProfilePage() {
    return (
        <ProfileEditor
            expectedRole="aspiring"
            title="Student Profile"
            nav={<NavBar buttons={navButtons} profile="Aspiring" user="Profile" email="Edit details" />}
        />
    );
}
