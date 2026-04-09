function adminHeader() {
    return(
        <div className="adminHeaderCard">
            <div className="adminHeaderContent">
                {/* <Image alt="Admin Profile Picture"></Image> */}
                <div className="adminTextContent">
                    <h1 className="adminName">{props.name}</h1>
                    <div className="adminBadge">
                        <h3 className="adminPosition">{props.position}</h3>
                    </div>
                    <p className="adminBio">{props.bio}</p>
                </div>
            </div>
            <div className="adminEditProfile">
                <button className="adminEditButton">
                    {/* <Image alt="Edit Icon"></Image> */}
                    Edit Profile
                </button>
            </div>
        </div>
    )
}

export default adminHeader