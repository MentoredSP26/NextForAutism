import NavButton from '../NavButton/page';
import './styles.css';

function NavBar(props) {
    const buttons = props.buttons;
    const profile = props.profile;
    return (
        <div className="navBar">
            <div className="nav-top">
                <img className="nav-logo" alt="Next for Autism Logo" src="matchingplatform/public/next-for-autism-logo.svg"/>
                <h1 className="nav-profile">{profile} Portal</h1>
            </div>
            <nav className="navBar-buttons">
                {buttons.map((btn, index) => (
                    <NavButton key={index} text={btn.text} path={btn.path}/>
                ))}
            </nav>
            <div className="navBar-bottom">
                <div className="nav-profile-circle">
                    {/* <Image alt="Profile Circle"></Image> */}
                </div>
                <div>
                <h1 className="user-name">{props.user}</h1>
                <h3 className="user-email">{props.email}</h3>
                </div>
            </div>    
        </div>
    )
}

export default NavBar