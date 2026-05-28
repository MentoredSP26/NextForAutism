'use client';

import WeeklyMaterials from "../../components/WeeklyMaterials/WeeklyMaterials";
import NavBar from "../../components/navbar/page";
import { useCurrentProfile } from "../../hooks/useCurrentProfile";
import './styles.css';

export default function EstablishedDashboard() {
    const currentProfile = useCurrentProfile();
    const navButtons = [
        { page: "Materials", path: "/established", icon: "/home-icon.svg" },
        { page: "Profile", path: "/established/profile", icon: "/profile-icon.svg" },
    ];

    return (
        <div className="established-page">
            <NavBar
                buttons={navButtons}
                profile="Established"
                user={currentProfile?.full_name || currentProfile?.email || 'Established'}
                email={currentProfile?.email || ''}
            />
            <main className="established-main">
                <div className='materials-page'>
                    <div className="established-dashboard-header">
                        <div className='materials-header'>
                            <h1>Weekly Program Materials</h1>
                        </div>
                        <p className='low-opacity-text'>Your curated learning path organized by week</p>
                    </div>
                    <WeeklyMaterials/>
                </div>
            </main>
        </div>
    );
}
