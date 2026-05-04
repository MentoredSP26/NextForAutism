import React from 'react'
import MaterialItem from './MaterialItem'

const LearningBox = ({week}) => {
  return (
    <div className='material-box'>
      
      <div className='week-bar'>
        <h2><b>Week {week.week}</b></h2>
        <a onClick={async () => {
          await fetch('https://lgmtapkhdwlgbkkcikqh.supabase.co/functions/v1/send-weekly-reminder', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ANON_KEY}` }
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

export default LearningBox
