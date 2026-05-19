import WeeklyMaterials from "../../components/WeeklyMaterials/WeeklyMaterials";
import NavBar from "../../components/navbar/page";
import './styles.css';

export default function EstablishedDashboard() {
    const navButtons = [
        { page: "Materials", path: "/established", icon: "/home.png" },
        { page: "Profile", path: "/established/profile", icon: "/profile.png" },
    ];

    return (
        <div className="established-page">
            <NavBar
                buttons={navButtons}
                profile="Established"
                user="Established User"
                email="mentor@next.org"
            />
            <main className="established-main">
                <div className='materials-page'>
                    <div className="established-dashboard-header">
                        <div className='materials-header'>
                            <h1>Weekly Learning Materials</h1>
                        </div>
                        <p className='low-opacity-text'>Your curated learning path organized by week</p>
                    </div>
                    <WeeklyMaterials/>
                </div>
            </main>
        </div>
    );
}
