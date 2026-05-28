'use client';

import NavBar from '../../../components/navbar/page';
import ProfileEditor from '../../../components/ProfileEditor/ProfileEditor';
import { useCurrentProfile } from '../../../hooks/useCurrentProfile';

const navButtons = [
    { page: "Dashboard", path: "/aspiring", icon: "/home-icon.svg" },
    { page: "Profile", path: "/aspiring/profile", icon: "/profile-icon.svg" },
];

export default function AspiringProfilePage() {
    const currentProfile = useCurrentProfile();

    return (
        <ProfileEditor
            expectedRole="aspiring"
            title="Aspiring Professional Profile"
            nav={
                <NavBar
                    buttons={navButtons}
                    profile="Aspiring"
                    user={currentProfile?.full_name || currentProfile?.email || 'Aspiring'}
                    email={currentProfile?.email || ''}
                />
            }
        />
    );
}
