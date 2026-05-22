"use client"
import { useState } from 'react'
import { createClient } from '../../api/createClient'

const supabase = createClient()

export default function MeetingLinkInput({ establishedId, currentLink }) {
  const [link, setLink] = useState(currentLink || "")
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    const { error } = await supabase
      .from("established_professionals")
      .update({ meeting_link: link })
      .eq("id", establishedId)

    if (error) {
      console.error("Error saving meeting link:", error)
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="meeting-link-input">
      <input
        type="text"
        placeholder="Paste your Zoom / Google Meet link here..."
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button onClick={handleSave}>{saved ? "Saved!" : "Save"}</button>
    </div>
  )
}