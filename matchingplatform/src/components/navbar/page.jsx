import NavButton from '../NavButton/page';

function NavBar(props) {
    const buttons = props.buttons;
    const profile = props.profile;
    return (
        <div className="navBar">
            <div className="navBar-image">
                {/* <Image alt="Next for Autism Logo"></Image> */}
                <h1>{profile} Portal</h1>
            </div>
            {/* props for number of buttons */}
            <nav className="navBar-buttons">
                {buttons.map((btn, index) => (
                    <NavButton key={index} text={btn.text} path={btn.path}/>
                ))}
            </nav>
            <div className="navBar-bottom">
                <div>
                    {/* <Image alt="Profile Circle"></Image> */}
                </div>
                <div>
                <h1>User</h1>
                <h3>User email</h3>
                </div>
            </div>    
        </div>
    )
}

export default NavBar