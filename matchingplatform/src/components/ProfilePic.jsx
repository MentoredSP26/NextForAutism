"use client";

import React, { useState } from "react";

function ProfilePic() {
    const [preview, setPreview] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            {preview && (
                <img
                    src={preview}
                    alt="Profile Preview"
                    style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover"
                    }}
                />
            )}

            <label style={{ cursor: "pointer", color: "black" }}>
                Upload Photo
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