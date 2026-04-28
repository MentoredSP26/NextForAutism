import NavBar from "../../components/navbar/page";
import Profile from "../../components/Profile/Profile";
import  React, { useState , useEffect } from 'react'
import ProfilePic from '../../components/ProfilePic/ProfilePic';

const establishedData = {
  name: "Bob Chen",
  initials: "BC",
  role: "Head Manager",
  status: "Available",
  bio: "Experienced program administrator with"
};

const buttons = [
  {text: 'Dashboard',
  path:null},
  {text: 'Profile',
  path:null}  
]

const attributes = {
  name: "Lorem Ipsum",
  role: "Established Mentor",
  status: "Available",
  email: "user@email.com",
  school: "Lorem Ipsum University"
}

export default function EstablishedProfile() {
  return(
      <div className = "layout">
        <div><NavBar buttons = {buttons}/></div>
        <div>
          <div><h2>Welcome back!</h2></div>
          <div className="profile">
            <div className='side'>
              <div><ProfilePic/></div>
              <div>
                <h1>{attributes.name}</h1>
                <h2>{attributes.role}</h2>
              </div>
            </div>
            <div className="attributes">
              <h2>{attributes.email}</h2>
              <h2>{attributes.school}</h2>
              <h2>{attributes.status}</h2>
            </div>
          </div>
          <DateTime></DateTime>
          <Profile />
          <br></br>
          <Profile />
          <br></br>
          <Profile />
        </div>
      </div>
  )
}



const DateTime = () => {

  const [date,setDate] = useState(new Date());
    
  useEffect(() => {
    const timer = setInterval(()=>setDate(new Date()), 1000 )
    return function cleanup() {
      clearInterval(timer)
    }
  });

  return(
      <div>
          <p> Date : {date.toLocaleDateString()}</p>
      </div>
    )
}