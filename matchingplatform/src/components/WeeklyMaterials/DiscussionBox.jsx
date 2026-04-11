import React from 'react'
import MaterialItem from './MaterialItem'

const DiscussionBox = ({week}) => {
  return (
    <div className='material-box-w-meeting'>
      
      <div className='week-bar-w-meeting'>
        <p><b>Week {week.week}</b></p>
        <a>Meeting Link</a>
        <a href="mailto:example@domain.com">Reminder</a>
      </div>

      <div>
        <p><b>Subject: </b> {week.subject}</p>
        <p>{week.description}</p>
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
