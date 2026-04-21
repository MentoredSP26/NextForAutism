'use client';
import NavButton from '../NavButton/page';
import './styles.css';

function NavBar(props) {
    const buttons = props.buttons;
    const profile = props.profile;

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
            <div className="navBar-bottom">
                <div className="bottom-content">
                    <div className="nav-profile-circle">
                        {/* <Image alt="Profile Circle"></Image> */}
                    </div>
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
