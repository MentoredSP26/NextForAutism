"use client";

import React, { useState } from 'react';
import ProfilePic from "@/components/ProfilePic";


function Profile() {
    
    return (
        <div>
            <ProfilePic/>
            <h1>Name</h1>
            <h2>Aspiring Professional</h2>
            <h3>Skills</h3>
            <h4>email</h4>
            <h5>Where they're based in</h5>
            <h6>When joined</h6>
            <h7>Carear goals</h7>
        </div>
    )
}

export default Profile;