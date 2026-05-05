"use client";

import React from 'react';
import ProfilePic from '../ProfilePic/ProfilePic';
import './Profile.css';

function Profile({
    name,
    title,
    interests = [],
    email,
    location,
    joinedDate,
    careerGoals,
    mentor = null
}) {
    return (
        <div className="profile-page">

            {/* ── Profile Card ── */}
            <div className="profile-card">
                <div className="profile-top">
                    <ProfilePic />
                    <div className="profile-info">
                        <h1 className="profile-name">{name}</h1>
                        <p className="profile-title">{title}</p>
                        <div className="profile-tags">
                            {interests.map((interest, i) => (
                                <span key={i} className="tag">{interest}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="profile-details">
                    {email && (
                        <div className="detail-row">
                            <img src="/EmailIcon.png" alt="email icon" className="detail-icon" />
                            <span>{email}</span>
                        </div>
                    )}
                    {location && (
                        <div className="detail-row">
                        <img src="/LocIcon.png" alt="location icon" className="detail-icon" />
                            <span>{location}</span>
                        </div>
                    )}
                    {joinedDate && (
                        <div className="detail-row">
                            <img src="/CalIcon.png" alt="calendar icon" className="detail-icon" />
                            <span>{joinedDate}</span>
                        </div>
                    )}
                    {careerGoals && (
                        <div className="detail-row career-goals">
                            <img src="/CarIcon.png" alt="career icon" className="detail-icon" />
                            <div>
                                <p className="goals-label">Career Goals</p>
                                <p className="goals-text">{careerGoals}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Mentor Card ── */}
            {mentor && (
                <div className="mentor-card">
                    <div className="mentor-card-header">
                        <h2 className="mentor-heading">Your Established Professional</h2>
                        <p className="mentor-sub">Guiding your professional journey</p>
                    </div>

                    <div className="mentor-body">
                        <div className="mentor-top">
                            <div className="mentor-avatar">
                                {mentor.avatarUrl
                                    ? <img src={mentor.avatarUrl} alt={mentor.name} />
                                    : <div className="mentor-avatar-placeholder">{mentor.name?.[0]}</div>
                                }
                            </div>
                            <div className="mentor-info">
                                <h3 className="mentor-name">{mentor.name}</h3>
                                <p className="mentor-role">{mentor.role}</p>
                                <p className="mentor-company">{mentor.company}</p>
                            </div>
                            <button className="message-btn">💬 Message</button>
                        </div>

                        {mentor.bio && <p className="mentor-bio">{mentor.bio}</p>}

                        {mentor.expertise?.length > 0 && (
                            <div className="mentor-expertise">
                                <p className="expertise-label">Areas of Expertise</p>
                                <div className="expertise-tags">
                                    {mentor.expertise.map((e, i) => (
                                        <span key={i} className="tag tag-outline">{e}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}


        </div>
    );
}

export default Profile;
