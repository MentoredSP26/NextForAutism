import React from 'react'
import MaterialItem from './MaterialItem'

const LearningBox = ({week}) => {
  return (
    <div className='material-box'>
      
      <div className='week-bar'>
        <p><b>Week {week.week}</b></p>
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

export default LearningBox
