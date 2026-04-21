const establishedData = {
    name: "Bob Chen",
    initials: "BC",
    role: "Head Manager",
    status: "Available",
    bio: "Experienced program administrator with",
  };
  
  export default function Profile() {
    return(
        <div>
            <div className="profile-avatar">{establishedData.initials}</div>
            <h2 className="profile-name">{establishedData.name}</h2>
            <span className="badge-role">{establishedData.role}</span>
            <button className="btn-edit-profile">Edit Profile</button>
            <p className="profile-bio">{establishedData.bio}</p>
        </div>
    )
  }