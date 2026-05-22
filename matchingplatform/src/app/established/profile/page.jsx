"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '../../../api/createClient';
import NavBar from "../../../components/navbar/page";
import Profile from '../../../components/Profile/Profile'
import './styles.css';
import ContainerBox from "../../../components/ContainerBox/page";
import MeetingLinkInput from '../../../components/MeetingLinkInput/page';

const supabase = createClient();

const buttons = [
  { page: 'Dashboard', path: '/established', icon: '/home.png' },
  { page: 'Profile', path: '/established/profile', icon: '/profile.png' }
]

export default function EstablishedProfile() {
  const [mentor, setMentor] = useState(null)
  const [mentees, setMentees] = useState([])
  const [loading, setLoading] = useState(true)
  const [mentorName, setMentorName] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
          setLoading(false)
          return   // your existing "No profile found. Make sure you are logged in." message will show
        }

        const userId = user.id

        if (!userId) {
          setLoading(false)
          return
        }

        const { data: epData, error: epError } = await supabase
          .from("established_professionals")
          .select(`
            id, company, job_title, field, years_experience, mentoring_capacity, meeting_link,
            profiles ( id, full_name, email, activity_status, location, bio, avatar_url, created_at )
          `)
          .eq("profile_id", userId)
          .single()

        if (epError) {
          console.error("Error fetching mentor profile:", epError)
          setLoading(false)
          return
        }

        setMentor(epData)
        setMentorName(epData.profiles?.full_name || "")

        const { data: matchData, error: matchError } = await supabase
          .from("matches")
          .select(`
            id, current_week, status,
            aspiring:profiles!matches_aspiring_id_fkey (
              full_name, email, location, bio, avatar_url, created_at
            )`)
          .eq("established_id", userId)
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
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="layout">
      <div><NavBar buttons={buttons} profile="Established Professional" user={mentorName} /></div>
      <div className="profile-page">
        <ContainerBox
          header="Established Mentor Profile"
          body={
            <div>
              <Profile
                name={profile.full_name}
                title="Established Professional"
                interests={mentor.field ? [mentor.field] : []}
                email={profile.email}
                location={profile.location || "Not specified"}
                joinedDate={new Date(profile.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                careerGoals={mentor.job_title || ""}
              />
              <div className="mentor-meta" style={{ marginTop: '16px' }}>
                <p>Status: {profile.activity_status}</p>
                <p>Capacity: {mentor.mentoring_capacity} Aspiring Professionals</p>
              </div>
              <div className="mentoring-fields" style={{ marginTop: '16px' }}>
                <h3>Mentoring Fields</h3>
                <div className="fields-row">
                  {mentor.field && <span className="field-tag">{mentor.field}</span>}
                </div>
              </div>
              <p className="profile-date">As of {today}</p>
            </div>
          }
        />

        <ContainerBox
          header="Meeting Link"
          body={
            <div>
              <p className="meeting-link-help">
                Set your meeting link here. The same link is used across all your sessions, so you only need to enter it once.
              </p>
              <MeetingLinkInput establishedId={mentor.id} currentLink={mentor.meeting_link} />
            </div>
          }
        />

        <ContainerBox
          header="Aspiring Professionals"
          body={
            <div className="mentees-section">
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
          }
        />
      </div>
    </div>
  )
}