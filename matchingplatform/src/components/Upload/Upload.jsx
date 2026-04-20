"use client";

import React, { ChangeEvent, useState } from 'react';

function Upload() {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

    return (
        <div className='space-y-4'>
            <input type="file" onChange={handleFileChange}/>
            {file && <p>Selected file: {file.name}</p>}
        </div>
    )
}

export default Upload;