'use client';

import NavBar from '../../../components/navbar/page';
import ProfileEditor from '../../../components/ProfileEditor/ProfileEditor';
import { useCurrentProfile } from '../../../hooks/useCurrentProfile';

const navButtons = [
    { page: "Materials", path: "/established", icon: "/home-icon.svg" },
    { page: "Profile", path: "/established/profile", icon: "/profile-icon.svg" },
];

export default function EstablishedProfilePage() {
    const currentProfile = useCurrentProfile();

    return (
        <ProfileEditor
            expectedRole="established"
            title="Established Professional Profile"
            nav={
                <NavBar
                    buttons={navButtons}
                    profile="Established"
                    user={currentProfile?.full_name || currentProfile?.email || 'Established'}
                    email={currentProfile?.email || ''}
                />
            }
        />
    );
}
