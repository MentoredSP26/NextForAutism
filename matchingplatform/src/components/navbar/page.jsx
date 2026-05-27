'use client';
import NavButton from '../NavButton/page';
import { createClient } from '../../api/createClient';
import { useRouter } from 'next/navigation';
import './styles.css';

function NavBar(props) {
    const buttons = props.buttons;
    const profile = props.profile;
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <div className="navBar">
            <div className="nav-top">
                <img className="logo" alt="Next for Autism Logo" src="/next-for-autism-logo-light.svg"/>
                <span className="nav-profile">{profile} Portal</span>
            </div>
            <nav className="navBar-buttons">
                <ul>
                    {buttons.map((btn, index) => (
                        <NavButton key={index} page={btn.page} path={btn.path} icon={btn.icon}/>
                    ))}
                </ul>
            </nav>
            <div className="logout-section">
                <button className="logout-btn" onClick={handleLogout}>
                    Sign Out
                </button>
            </div>
            <div className="navBar-bottom">
                <div className="bottom-content">
                    <div className="nav-profile-circle"></div>
                    <div className="user-text">
                        <span className="user-name">{props.user}</span>
                        <span className="user-email">{props.email}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavBar;
