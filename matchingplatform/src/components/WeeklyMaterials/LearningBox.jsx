import React from 'react'
import MaterialItem from './MaterialItem'

const LearningBox = ({week}) => {
  return (
    <div className='material-box'>
      
      <div className='week-bar'>
        <h2><b>Week {week.week}</b></h2>
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
