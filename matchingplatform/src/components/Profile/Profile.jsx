"use client";

import React, { useState } from 'react';
import ProfilePic from '../ProfilePic/ProfilePic';
import './Profile.css';


function Profile({
    name,
    title,
    interests,
    email,
    location,
    joinedDate,
    careerGoals,
}
) {
    
    return (
        <div className='box'> 
            <div className="profile">
                <div className='side'>
                    <div><ProfilePic/></div>
                    <div>
                        <h1>{name}</h1>
                        <h2>{title}</h2>
                        <div className="greySide">
                            {interests.map((interest, index) => (
                                <h3 key={index} className="grey">
                                    {interest}
                                </h3>
                             ))}
                        </div>
                    </div>
                </div>
                <h4>
                    <div className="Row">
                        <img src="/EmailIcon.png"alt="email icon" className="icon" />
                        <div>{email}</div>
                    </div>
                    <div className="Row">
                        <img src="/LocIcon.png" alt="Loc icon" className="icon" />
                        <div>{location}</div>
                    </div>
                    <div className="Row">
                        <img src="/CalIcon.png"alt="Cal icon" className="icon" />
                        <div>{joinedDate}</div>
                    </div>
                </h4>
                <h5 className="Row">
                    <img src="/CarIcon.png" alt="Car icon" className="icon" />
                    <div>Career Goals</div>
                </h5>
                <h6>{careerGoals}</h6>
            </div>
        </div>
    );
}

export default Profile;