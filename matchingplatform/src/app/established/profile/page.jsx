'use client';

import NavBar from '../../../components/navbar/page';
import ProfileEditor from '../../../components/ProfileEditor/ProfileEditor';

const navButtons = [
    { page: "Materials", path: "/established", icon: "/home.png" },
    { page: "Profile", path: "/established/profile", icon: "/profile.png" },
];

export default function EstablishedProfilePage() {
    return (
        <ProfileEditor
            expectedRole="established"
            title="Mentor Profile"
            nav={<NavBar buttons={navButtons} profile="Established" user="Profile" email="Edit details" />}
        />
    );
}
