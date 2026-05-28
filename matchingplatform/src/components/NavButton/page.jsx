import './styles.css';


function NavButton({ page, path, icon }) {
    return (
        <li className="button">
            <a className="nav-button" href={path}>
                <div className="content">
                    <span className="nav-logo" style={{ '--nav-icon': `url(${icon})` }} aria-hidden="true"></span>
                    <span className="button-text">{page}</span>
                </div>
            </a>
        </li>
    )
}

export default NavButton;
