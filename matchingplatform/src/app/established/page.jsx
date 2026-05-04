"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import WeeklyMaterials from "../../components/WeeklyMaterials/WeeklyMaterials";
import NavBar from "../../components/navbar/page";
import './styles.css'

const buttons = [
  { text: 'Dashboard', path: '/established' },
  { text: 'Profile', path: '/established/profile' }
]

export default function EstablishedDashboard() {
  const [mentorName, setMentorName] = useState("")
  const [currentWeek, setCurrentWeek] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      // const { data: { session } } = await supabase.auth.getSession()
      // if (!session) { router.push("/login"); return }

      const userId = 'e1000000-0000-0000-0000-000000000003'

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single()

      if (profile) setMentorName(profile.full_name)

      const { data: match } = await supabase
        .from("matches")
        .select("current_week")
        .eq("established_id", userId)
        .eq("status", "active")
        .single()

      if (match) setCurrentWeek(match.current_week)
    }
    fetchData()
  }, [])

  return (
    <div className="layout">
      <div><NavBar buttons={buttons} /></div>
      <div className='materials-page'>
        <div className="established-dashboard-header">
          <div className='materials-header'>
            <h1>Weekly Learning Materials</h1>
            {mentorName && <p>Welcome back, {mentorName} 👋</p>}
            {currentWeek && <p>You are currently on Week {currentWeek}</p>}
          </div>
          <p className='low-opacity-text'>Your curated learning path organized by week</p>
        </div>
        <WeeklyMaterials currentWeek={currentWeek} />
      </div>
    </div>
  )
}