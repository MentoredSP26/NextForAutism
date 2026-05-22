"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../api/createClient";
import WeeklyMaterials from "../../components/WeeklyMaterials/WeeklyMaterials";
import NavBar from "../../components/navbar/page";
import './styles.css'
import ContainerBox from "../../components/ContainerBox/page";

const supabase = createClient();
const buttons = [
  { page: 'Dashboard', path: '/established', icon: '/home.png' },
  { page: 'Profile', path: '/established/profile', icon: '/profile.png' }
]

export default function EstablishedDashboard() {
  const [mentorName, setMentorName] = useState("")
  const [currentWeek, setCurrentWeek] = useState(null)
  const [meetingLink, setMeetingLink] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/login')   // not logged in — send them to login
        return
      }

      const userId = user.id

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single()

      if (profile) setMentorName(profile.full_name)

      const { data: matches } = await supabase
        .from("matches")
        .select("current_week")
        .eq("established_id", userId)
        .eq("status", "active")
        .limit(1)

      if (matches && matches.length > 0) {
        setCurrentWeek(matches[0].current_week)
      }

      const { data: ep } = await supabase
        .from("established_professionals")
        .select("meeting_link")
        .eq("profile_id", userId)
        .single()

      if (ep) setMeetingLink(ep.meeting_link)
    }
    fetchData()
  }, [])

  const subText = `Your curated learning path organized by week${currentWeek ? ` · Currently on Week ${currentWeek}` : ''}`

  return (
    <div className="layout">
      <div><NavBar buttons={buttons} profile="Established Professional" user={mentorName} /></div>
      <div className='materials-page'>
        {mentorName && (
          <div className="dashboard-welcome">
            <h1>Welcome back, {mentorName} 👋</h1>
          </div>
        )}
        <ContainerBox
          header="Weekly Learning Materials"
          body={
            <div>
              <p className="container-subtext">{subText}</p>
              <WeeklyMaterials currentWeek={currentWeek} meetingLink={meetingLink} />
            </div>
          }
        />
      </div>
    </div>
  )
}