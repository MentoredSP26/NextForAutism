"use client";

import React, { useState } from 'react';

function ProfilePic() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div>
            {preview && (
                <img
                    src={preview}
                    alt="Profile Preview"
                    style={{ width: '150px', borderRadius: '50%' }}
                />
            )}
            <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
            />
        </div>
    );
}

export default ProfilePic;