"use client";

import React, { useState } from 'react';
import ProfilePic from "@/components/ProfilePic";
import './Profile.css';
import email from "../assets/emailIcon.png";
import Loc from "../assets/LocIcon.png";
import Cal from "../assets/CalIcon.png";
import Car from "../assets/CarIcon.png";


function Profile() {
    
    return (
        <div className='box'> 
            <div className="profile">
                <div className='side'>
                    <div><ProfilePic/></div>
                    <div>
                        <h1>Sarah Johnson</h1>
                        <h2>Aspiring Professional</h2>
                        <div className="greySide">
                            <h3 className = "grey">Technology</h3>
                            <h4 className = "grey">UX Design</h4>
                        </div>
                    </div>
                </div>
                <h4>
                    <div className="Row">
                        <img src={email} alt="email icon" className="icon" />
                        <div>sarah.johnson@email.com</div>
                    </div>
                    <div className="Row">
                        <img src={Loc} alt="Loc icon" className="icon" />
                        <div>New York, NY</div>
                    </div>
                    <div className="Row">
                        <img src={Cal} alt="Cal icon" className="icon" />
                        <div>Joined January 2026</div>
                    </div>
                </h4>
                <h5 className="Row">
                    <img src={Car} alt="Car icon" className="icon" />
                    <div>Career Goals</div>
                </h5>
                <h6>Seeking to build a career in accessible technology design and development</h6>
            </div>
        </div>
    );
}

export default Profile;