"use client";

import React, { useState } from "react";

function ProfilePic() {
    const [preview, setPreview] = useState("/default-profile.png");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>

            <label style={{ cursor: "pointer" }}>
                
                <img
                    src={preview}
                    alt="Profile"
                    style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "15px"
                    }}
                />
                
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
            </label>
        </div>
    );
}

export default ProfilePic;