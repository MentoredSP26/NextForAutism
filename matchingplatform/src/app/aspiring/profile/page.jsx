'use client';
import NavBar from '../../../components/navbar/page';
import Profile from "../../../components/Profile/Profile.jsx";
import './styles.css';

const navButtons = [
    { page: "Dashboard", path: "/aspiring", icon: "/home.png" },
    { page: "Aspiring Profile", path: "/aspiring/profile", icon: "/profile.png" },
];

function AspiringProfilePage() {
    return (
        <div className="aspiring-page">
            <NavBar buttons={navButtons} profile="Aspiring" user="Aspiring User" email="aspiring@next.org" />
            <div className="asp-profile-content">
                <Profile
                    title="My Profile"
                    interests={["Coding", "Design", "Music"]}
                />
            </div>
        </div>
    );
}

export default AspiringProfilePage;