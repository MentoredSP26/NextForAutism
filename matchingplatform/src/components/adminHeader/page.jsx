import './styles.css';

function AdminHeader({name, position, bio}) {
    return(
        <div className="admin-header-card">
            <div className="inner-card">
                <div className="admin-content">
                    {/* <Image alt="Admin Profile Picture"></Image> */}
                    <div className="admin-text-content">
                        <span className="admin-name">{name}</span>
                        <div className="admin-badge">
                            <span className="admin-position">{position}</span>
                        </div>
                        <span className="admin-bio">{bio}</span>
                    </div>
                </div>
                <div className="admin-edit-profile">
                    <button className="admin-edit-button">
                        {/* <Image alt="Edit Icon"></Image> */}
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminHeader