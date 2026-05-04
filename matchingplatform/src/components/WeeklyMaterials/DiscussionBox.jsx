import React from 'react'
import MaterialItem from './MaterialItem'

const DiscussionBox = ({week}) => {
  return (
    <div className='material-box-w-meeting'>
      
      <div className='week-bar-w-meeting'>
        <h2><b>Week {week.week}</b></h2>
        <a><img src="/video.png" alt = "bell icon" className='logo-sizing'></img></a>
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
