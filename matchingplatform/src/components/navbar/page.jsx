'use client';
import { useState, useEffect, useRef } from 'react';
import NavButton from '../NavButton/page';
import { createClient } from '../../api/createClient';
import { useRouter } from 'next/navigation';
import './styles.css';

function NavBar(props) {
    const buttons = props.buttons;
    const profile = props.profile;
    const router = useRouter();
    const [popupOpen, setPopupOpen] = useState(false);
    const popupRef = useRef(null);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    // close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setPopupOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="navBar">
            <div className="nav-top">
                <img className="logo" alt="Next for Autism Logo" src="/logo.png"/>
                <span className="nav-profile">{profile} Portal</span>
            </div>
            <nav className="navBar-buttons">
                <ul>
                    {buttons.map((btn, index) => (
                        <NavButton key={index} page={btn.page} path={btn.path} icon={btn.icon}/>
                    ))}
                </ul>
            </nav>

            <div ref={popupRef}>
                {popupOpen && (
                    <div className="signout-popup">
                        <button className="signout-button" onClick={handleLogout}>
                            Sign Out
                        </button>
                    </div>
                )}
                <div className="navBar-bottom" onClick={() => setPopupOpen(!popupOpen)}>
                    <div className="bottom-content">
                        <div className="nav-profile-circle">
                            <span className="user-initial">
                                {props.user ? props.user.charAt(0).toUpperCase() : 'U'}
                            </span>
                        </div>
                        <div className="user-text">
                            <span className="user-name">{props.user}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default NavBar;