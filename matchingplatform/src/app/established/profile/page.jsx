"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import NavBar from "../../../components//navbar/page";
import ProfilePic from '../../../components/ProfilePic/ProfilePic';
import './styles.css';

const buttons = [
  { text: 'Dashboard', path: '/established' },
  { text: 'Profile', path: '/established/profile' }
]

export default function EstablishedProfile() {
  const [mentor, setMentor] = useState(null)
  const [mentees, setMentees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // const { data: { session } } = await supabase.auth.getSession()
        // const userId = session?.user?.id
        const userId = 'e1000000-0000-0000-0000-000000000003'

        if (!userId) {
          console.error("No session found")
          setLoading(false)
          return
        }

        const { data: epData, error: epError } = await supabase
          .from("established_professionals")
          .select(`
            id, company, job_title, field, years_experience, mentoring_capacity,
            profiles ( id, full_name, email, activity_status, location, bio, avatar_url )
          `)
          .eq("profile_id", userId)
          .single()

        if (epError) {
          console.error("Error fetching mentor profile:", epError)
          setLoading(false)
          return
        }

        setMentor(epData)

        const { data: matchData, error: matchError } = await supabase
        .from("matches")
        .select(`
          id, current_week, status,
          aspiring:profiles!matches_aspiring_id_fkey (
          full_name, email, location, bio, avatar_url, created_at
        )`)
  .eq("established_id", epData.id)
  .eq("status", "active")

        if (matchError) {
          console.error("Error fetching mentees:", matchError)
        } else {
          setMentees(matchData || [])
        }

      } catch (err) {
        console.error("Unexpected error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="profile-loading">Loading...</div>
  if (!mentor) return <div className="profile-loading">No profile found. Make sure you are logged in.</div>

  const profile = mentor.profiles

  return (
    <div className="layout">
      <div><NavBar buttons={buttons} /></div>
      <div className="profile-page">

        <div className="mentor-header">
          <ProfilePic />
          <div>
            <h1 className="mentor-name">{profile.full_name}</h1>
            <h2 className="mentor-role">Established Professional</h2>
          </div>
        </div>

        <div className="mentor-info">
          <p>✉ {profile.email}</p>
          <p>🏢 {mentor.company}</p>
          <p>💼 {mentor.job_title}</p>
          <p>📍 {profile.location}</p>
        </div>

        <div className="mentor-meta">
          <p>Status: {profile.activity_status}</p>
          <p>Capacity: {mentor.mentoring_capacity} Aspiring Professionals</p>
        </div>

        <div className="mentoring-fields">
          <h3>Mentoring Fields</h3>
          <div className="fields-row">
            {mentor.field && <span className="field-tag">{mentor.field}</span>}
          </div>
        </div>

        <div className="mentees-section">
          <h3>Aspiring Professionals</h3>
          {mentees.length === 0 && <p className="no-mentees">No mentees assigned yet.</p>}
          {mentees.map((match) => {
            const apProfile = match.aspiring
            if (!apProfile) return null

            return (
              <div key={match.id} className="mentee-card">
                <div className="mentee-card-header">
                  <div className="mentee-name-block">
                    <h4>{apProfile.full_name}</h4>
                    <p>Aspiring Professional</p>
                    <div className="mentee-tags">
                      
                    </div>
                  </div>
                  <a href={`mailto:${apProfile.email}`} className="mentee-email-btn">✉</a>
                </div>
                <p className="mentee-detail">✉ {apProfile.email}</p>
                {apProfile.location && <p className="mentee-detail">📍 {apProfile.location}</p>}
                {apProfile.bio && <p className="mentee-detail">📝 {apProfile.bio}</p>}
                {apProfile.created_at && (
                  <p className="mentee-detail">📅 Joined {new Date(apProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                )}
                
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}