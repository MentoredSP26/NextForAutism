"use client";

import React, { useState } from 'react';

function Assignment() {

    return (
        <div>
            <h2>Video</h2>
            <iframe
                src="https://player.vimeo.com/video/1135354938"
                width="700vw"
                height="700vh">
            </iframe>
            <h2>Pre/Post Session Worksheet</h2>
            <iframe src="https://drive.google.com/file/d/1q6_tfUcUk7F3zrtdQgl5SI9Y5UqZpF_g/preview" 
                width="700vw" 
                height="700vw">
            </iframe>
        </div>
    )
}

export default Assignment;