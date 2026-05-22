import React from 'react'
import MaterialItem from './MaterialItem'

const DiscussionBox = ({ week, meetingLink}) => {
  const safeLink = typeof meetingLink === 'string' 
    ? (meetingLink.startsWith('http') ? meetingLink : `https://${meetingLink}`)
    : null

  return (
    <div className='material-box-w-meeting'>
      
      <div className='week-bar-w-meeting'>
        <h2><b>Week {week.week}</b></h2>
        <a href={safeLink || "#"} target="_blank" rel="noopener noreferrer" style={{ opacity: safeLink ? 1 : 0.4, cursor: safeLink ? 'pointer' : 'not-allowed' }} title={safeLink ? "Join meeting" : "No meeting link set yet"}><img src="/video.png" alt="meeting icon" className='logo-sizing' /></a>
        <a onClick={async () => {
          await fetch('https://lgmtapkhdwlgbkkcikqh.supabase.co/functions/v1/send-weekly-reminder', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` }
          });
          alert('Weekly reminder sent!'); }} style={{ cursor: 'pointer' }}><img src="/belll.png" alt="bell icon" className='logo-sizing'/>
        </a>
      </div>

      <div>
        <p><b>Subject: </b> {week.subject}</p>
        <p className='low-opacity-text'>{week.description}</p>
      </div>
      
      <div className='material-description'>
            {week.items.map((item, index) => (
                <MaterialItem key = {index} items = {item}/>
            ))}
      </div>

      <div><p>{week.footer}</p></div>

    </div>
  )
}

export default DiscussionBox