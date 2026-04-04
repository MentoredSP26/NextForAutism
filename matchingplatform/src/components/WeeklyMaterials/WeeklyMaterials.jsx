import React from 'react'

const WeeklyMaterials = () => {
  return (

        <div className='carousel-container'>

            <div className='material-box'>

                <div className='material-box-w/o-meeting'>
                    <h2>Week N</h2>
                    <a href="mailto:example@domain.com">Reminder</a>
                </div>

                <div>
                    <p>Week Overview</p>
                </div>
                
                <br></br>

                <div className='material-description'>
                    <div className='description-&-logo'>
                        <img alt = "logo of what the material is"></img>
                        <p>Material Description</p>
                    </div>
                    <p>Estimated time to complete</p>
                </div>

            </div>

            <div className='material-box-w-meeting'>

                <div className='week-bar-w-meeting'>
                    <h2>Week N</h2>
                    <a href="mailto:example@domain.com">Reminder</a>
                    <a>Meeting Link</a>
                </div>
                
                <div>
                    <p>Description...</p>
                </div>

                <br></br>

                <div className='material-description'>
                    <div className='description-&-logo'>
                        <img alt = "logo of what the material is"></img>
                        <p>Material Description</p>
                    </div>
                    <p>Estimated time to complete</p>
                </div>
            </div>

            <div className='material-box'>

                <div className='material-box-w/o-meeting'>
                    <h2>Week N</h2>
                    <a href="mailto:example@domain.com">Reminder</a>
                </div>

                <div>
                    <p>Week Overview</p>
                </div>
                
                <br></br>

                <div className='material-description'>
                    <div className='description-&-logo'>
                        <img alt = "logo of what the material is"></img>
                        <p>Material Description</p>
                    </div>
                    <p>Estimated time to complete</p>
                </div>

            </div>

        </div>
  )
}

export default WeeklyMaterials