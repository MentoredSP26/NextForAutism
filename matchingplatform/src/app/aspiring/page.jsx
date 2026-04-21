'use client';
import ContainerBox from '../../components/ContainerBox/page';
import NavBar from '../../components/navbar/page';
import TodoList from '../../components/TodoList/TodoList';
import WeeklyMaterials from '../../components/WeeklyMaterials/WeeklyMaterials'
import './styles.css';

const navButtons = [
    { page: "Dashboard", path: "/aspiring", icon: "/home.png" },
    { page: "Aspiring Profile", path: "/aspiring/profile", icon: "/profile.png" },
];

const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
});

function AspiringDashboard() {
    return (
        <div className="aspiring-page">
            <NavBar buttons={navButtons} profile="Aspiring" user="Aspiring User" email="aspiring@next.org" />
            <div className='dashboard-content'>
                <div className='dash-header'>
                    <h1 className="welcome-name">Welcome Back, Sarah</h1>
                    <p className="date-dsp">{today}</p>
                </div>
               
                <span><TodoList /></span>
                <span><ContainerBox header={<h1>Weekly Materials</h1>} body={<WeeklyMaterials />} width="80vw"/></span>
                
            </div>
        </div>
    );
}

export default AspiringDashboard;