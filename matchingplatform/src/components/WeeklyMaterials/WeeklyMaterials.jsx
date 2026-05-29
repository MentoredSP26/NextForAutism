import React from 'react'
import './styles.css'
import LearningBox from './LearningBox'
import DiscussionBox from './DiscussionBox'

const weeks = [
    {   
        week: 1,
        type: "learning",
        subject: "NEXT Connects Learning Week: Professional Connection",
        description: "This week's topic in NEXT Connects is Professional Connection! You'll learn what professional connection means and how it can help you grow—both at work and in life.",
        footer: "Next week: You'll finally get to meet your matched professional and start learning together!",
        items: [
            { icon: "/play.png", text: "Video: What is Next Connects?", link: "https://vimeo.com/1135356068?share=copy&fl=sv&fe=ci" },
            { icon: "/assigment.png", text: "Assigment: Professional Communication Guide", link: "https://drive.google.com/file/d/1FcELgUl-_mTD1Bn4LI_bcEIpUQZDEC0-/view?usp=share_link" },
            { icon: "/assigment.png", text: "Assigment: Pre-Session Worksheet", link: "https://drive.google.com/file/d/1q6_tfUcUk7F3zrtdQgl5SI9Y5UqZpF_g/view?usp=share_link" },
            { icon: "/assigment.png", text: "Assigment: Schedule a meeting with your matched professional", link: "https://docs.google.com/document/d/1SeVK2SldbBOvKiPOj_XytbAVyohuZKzOylELLOjbCy8/edit?usp=sharing"}
        ]
        
    },

    {
        week: 2,
        type: "discussion",
        subject: "NEXT Connects Discussion Week: Time for Your First Chat!",
        description: "It's Discussion Week in NEXT Connects — time for your first chat with your matched professional! This is your chance to get to know each other and talk about what you've been learning so far.",
        footer: "We can't wait to hear how your first meeting goes!",
        items: [
            { icon: "/agenda.png", text: "Agenda: Professional Connection Agenda", link: "https://drive.google.com/file/d/1NsVmRllVbRohRPS9z0ETwb1Y8CK-KGwi/view?usp=share_link" },
            { icon: "/video.png", text: "Discussion: Meet with your matched professional", link: "" },
            { icon: "/assigment.png", text: "Assignment: Post-Session Worksheet", link: "https://drive.google.com/file/d/1q6_tfUcUk7F3zrtdQgl5SI9Y5UqZpF_g/view?usp=share_link" }
        ]
    },

    {
        week: 3,
        type: "learning",
        subject: "NEXT For Autism Learning Week: Goal Setting",
        description: "This week's topic for NEXT Connects is Goal Setting!",
        footer: "Next week: you'll share your goals with your matched professional!",
        items: [
            { icon: "/play.png", text: "Video: Goal Setting", link: "https://vimeo.com/1134698212?share=copy&fl=sv&fe=ci" },
            { icon: "/assigment.png", text: "Assignment: SMART Goals Worksheet", link: "https://drive.google.com/file/d/1FcELgUl-_mTD1Bn4LI_bcEIpUQZDEC0-/view?usp=share_link" },
            { icon: "/assigment.png", text: "Assignment: Pre-Session Worksheet", link: "https://drive.google.com/file/d/1dsPfM6yaejJ533m6kRZPaOZcSlCRxCqO/view?usp=share_link" },
            { icon: "/assigment.png", text: "Assignment: Schedule a meeting with your matched professional", link: "https://docs.google.com/document/d/1SeVK2SldbBOvKiPOj_XytbAVyohuZKzOylELLOjbCy8/edit?usp=sharing" }
        ]
    },

    {
        week: 4,
        type: "discussion",
        subject: "NEXT Connects Discussion Week: Let's Talk About Your Goals!",
        description: "This week, meet with your matched professional to talk about your goals.",
        footer: "Choose 1–2 goals to focus on together!",
        items: [
            { icon: "/assigment.png", text: "Review: SMART Goals Worksheet", link: "https://drive.google.com/file/d/1FcELgUl-_mTD1Bn4LI_bcEIpUQZDEC0-/view?usp=share_link" },
            { icon: "/agenda.png", text: "Agenda: Goal Setting Agenda", link: "https://drive.google.com/file/d/1dWate9NOpJhNtGxMVQxUT4iECp15z-dW/view?usp=share_link" },
            { icon: "/video.png", text: "Discussion: Meet with your matched professional", link: "" },
            { icon: "/assigment.png", text: "Assignment: Post-Session Worksheet", link: "https://drive.google.com/file/d/1dsPfM6yaejJ533m6kRZPaOZcSlCRxCqO/view?usp=share_link" }
        ]
    },

    {
        week: 5,
        type: "learning",
        subject: "NEXT For Autism Learning Week: Learning About Communication!",
        description: "This week's lesson is all about communication styles and strategies.",
        footer: "Great communication makes every partnership stronger!",
        items: [
            { icon: "/play.png", text: "Video: Communication", link: "https://vimeo.com/1134698406?share=copy&fl=sv&fe=ci" },
            { icon: "/assigment.png", text: "Review: Professional Connection Form", link: "https://drive.google.com/file/d/1c2MJiC6CA9c8MzLVGlX5x-NElmzK2BJi/view?usp=share_link" },
            { icon: "/assigment.png", text: "Assignment: Pre-Session Worksheet", link: "https://drive.google.com/file/d/1i9QrC9RewFnR25vLFShw_wI2dqR_A97Z/view?usp=share_link" },
            { icon: "/assigment.png", text: "Assignment: Schedule a meeting with your matched professional", link: "https://docs.google.com/document/d/1SeVK2SldbBOvKiPOj_XytbAVyohuZKzOylELLOjbCy8/edit?usp=sharing" }
        ]
    },

    {
        week: 6,
        type: "discussion",
        subject: "NEXT For Autism Discussion Week: Let's Talk About Communication!",
        description: "It's time for another meeting!",
        footer: "",
        items: [
            { icon: "/agenda.png", text: "Agenda: Communication Agenda", link: "https://drive.google.com/file/d/1TB4vIVTGsJo_oDSS2oiMaw5jId7unz2_/view?usp=share_link" },
            { icon: "/video.png", text: "Discussion: Meet with your matched professional", link: "" },
            { icon: "/assigment.png", text: "Assignment: Post-Session Worksheet", link: "https://drive.google.com/file/d/1i9QrC9RewFnR25vLFShw_wI2dqR_A97Z/view?usp=share_link" }
        ]
    },

    {
        week: 7,
        type: "learning",
        subject: "NEXT For Autism Learning Week: Workplace Intangibles",
        description: "Learn about soft skills like teamwork and attitude.",
        footer: "",
        items: [
            {icon: "/assigment.png", text: "Assigment: Workplace Intangibles", link:"https://drive.google.com/file/d/1dFEz-LUU8tkGITb9Zcfxr29bqZftVTeH/view?usp=share_link" },
            { icon: "/play.png", text: "Video: Workplace Intangibles", link: "https://vimeo.com/1135353223?share=copy&fl=sv&fe=ci" },
            { icon: "/assigment.png", text: "Assignment: Workplace Intangibles Worksheet", link: "https://drive.google.com/file/d/13jJwGMCTYKkvGPdGuzu-hD8CPiDl-p4h/view?usp=share_link" },
            { icon: "/assigment.png", text: "Assignment: Pre-Session Worksheet", link: "https://drive.google.com/file/d/1dSe07WSSNupvtAxUZHPR-bBpRa9I9aSg/view?usp=share_link" },
            { icon: "/assigment.png", text: "Assignment: Schedule a meeting with your matched professional", link: "https://docs.google.com/document/d/1SeVK2SldbBOvKiPOj_XytbAVyohuZKzOylELLOjbCy8/edit?usp=sharing" }
        ]
    },

    {
        week: 8,
        type: "discussion",
        subject: "NEXT For Autism Discussion Week: Let's Talk About Workplace Intangibles",
        description: "Share what you learned about soft skills.",
        footer: "",
        items: [
            { icon: "/agenda.png", text: "Agenda: Intangibles Agenda", link: "https://drive.google.com/file/d/1q7gnFIrMP-hzq45urcsNdlfKUo1hIh0p/view?usp=share_link" },
            { icon: "/video.png", text: "Discussion: Meet with your matched professional", link: "" },
            { icon: "/assigment.png", text: "Assignment: Post-Session Worksheet", link: "https://drive.google.com/file/d/1dSe07WSSNupvtAxUZHPR-bBpRa9I9aSg/view?usp=share_link" }
        ]
    },

    {
        week: 9,
        type: "learning",
        subject: "NEXT For Autism Learning Week: Universal Design",
        description: "Learn how Universal Design helps make spaces and systems work better for everyone.",
        footer: "You're halfway through this guided professional connection… great job!",
        items: [
            { icon: "/play.png", text: "Video: Universal Design", link: "https://vimeo.com/1134721852?share=copy&fl=sv&fe=ci" },
            { icon: "/assigment.png", text: "Review: Universal Design Guide", link: "https://drive.google.com/file/d/1fhxt9ZT54bE9DFvR805dIm_W7caAW_IQ/view?usp=share_link" },
            { icon: "/assigment.png", text: "Review: Accommodation Request Letter", link: "https://drive.google.com/file/d/1pVLIHoLvYVw_1MPPhTHdF_-t_Gc-e7SQ/view?usp=share_link" },
            { icon: "/assigment.png", text: "Assignment: Pre-Session Worksheet", link: "https://drive.google.com/file/d/19zpRZbaIIYpVdM_x2EVX2Z0nhlvcavqC/view?usp=share_link" },
            { icon: "/assigment.png", text: "Assignment: Schedule a meeting", link: "https://docs.google.com/document/d/1SeVK2SldbBOvKiPOj_XytbAVyohuZKzOylELLOjbCy8/edit?usp=sharing" }

        ]
    },

    {
        week: 10,
        type: "discussion",
        subject: "NEXT For Autism Discussion Week: Let's Talk About Universal Design",
        description: "Talk about how small changes can make workplaces easier for everyone.",
        footer: "",
        items: [
            { icon: "/agenda.png", text: "Agenda: Universal Design Agenda", link: "https://drive.google.com/file/d/1U39d0DNwkWkWFRP3_XmhUP0d82wyfGTT/view?usp=share_link" },
            { icon: "/video.png", text: "Discussion: Meet with your matched professional", link: "" },
            { icon: "/assigment.png", text: "Assignment: Post-Session Worksheet", link: "https://drive.google.com/file/d/19zpRZbaIIYpVdM_x2EVX2Z0nhlvcavqC/view?usp=share_link" }
        ]
    },

    {
        week: 11,
        type: "learning",
        subject: "NEXT For Autism Learning Week: The Job Search",
        description: "Learn about finding the right job fit.",
        footer: "These tools will help you feel more confident.",
        items: [
            { icon: "/play.png", text: "Video: Job Search", link: "https://vimeo.com/1134696816?share=copy&fl=sv&fe=ci" },
            { icon: "/assigment.png", text: "Review: Inclusive Job Description", link: "https://drive.google.com/file/d/1MJvmB8DlyIeD31T7Mh-MYSMSB6WBEq00/view?usp=share_link" },
            { icon: "/assigment.png", text: "Assignment: Pre-Session Worksheet", link: "https://drive.google.com/file/d/1lew8hvhaHUAl5OsZ_7hSf4jxxoms7IuG/view?usp=share_link" },
            { icon: "/assigment.png", text: "Assignment: Schedule a meeting", link: "https://docs.google.com/document/d/1SeVK2SldbBOvKiPOj_XytbAVyohuZKzOylELLOjbCy8/edit?usp=sharing" }
        ]
    },

    {
        week: 12,
        type: "discussion",
        subject: "NEXT Connects Discussion Week: Talking About Job Search",
        description: "Meet with your matched professional again!",
        footer: "",
        items: [
            { icon: "/agenda.png", text: "Agenda: Job Search Agenda", link: "https://drive.google.com/file/d/1w2crTwGb7TD6tDwm0DWqQ6dmcI6BHt5d/view?usp=share_link" },
            { icon: "/video.png", text: "Discussion: Meet with your matched professional", link: "" },
            { icon: "/assigment.png", text: "Assignment: Post-Session Worksheet", link: "https://drive.google.com/file/d/1lew8hvhaHUAl5OsZ_7hSf4jxxoms7IuG/view?usp=share_link" }
        ]
    },

    {
        week: 13,
        type: "learning",
        subject: "NEXT For Autism Learning Week: Getting Ready for Interviews",
        description: "Interviews can be tricky — this lesson makes it easier!",
        footer: "",
        items: [
            { icon: "/play.png", text: "Video: Interviewing", link: "https://vimeo.com/1134697545?share=copy&fl=sv&fe=ci" },
            { icon: "/assigment.png", text: "Assignment: Prep Guide", link: "https://drive.google.com/file/d/1tQn5-nqbfHwhbmn9eRwg_bLl0-iSHE99/view?usp=share_link" },
            { icon: "/assigment.png", text: "Assignment: Checklist", link: "https://drive.google.com/file/d/1fcLOO2cuiUv_DpcQfEsrHtZHQ7NXX_FN/view?usp=share_link" },
            { icon: "/assigment.png", text: "Assignment: Pre-Session Worksheet", link: "https://drive.google.com/file/d/1WpoL2YS4JTWmbirJ538mZTrvUq7Ay_ZV/view?usp=share_link" },
            { icon: "/assigment.png", text: "Assignment: Schedule a meeting", link: "https://docs.google.com/document/d/1SeVK2SldbBOvKiPOj_XytbAVyohuZKzOylELLOjbCy8/edit?usp=sharing" }
        ]
    },

    {
        week: 14,
        type: "discussion",
        subject: "NEXT For Autism Discussion Week: Talking About Interviewing",
        description: "Practice and discuss interviews.",
        footer: "",
        items: [
            { icon: "/agenda.png", text: "Agenda: Interviewing Agenda", link: "https://drive.google.com/file/d/1ci7xnLv9nwvvRcgZe1rEw4hABsPlVlGr/view?usp=share_link" },
            { icon: "/video.png", text: "Discussion: Practice interview", link: "" },
            { icon: "/assigment.png", text: "Assignment: Post-Session Worksheet", link: "https://drive.google.com/file/d/1WpoL2YS4JTWmbirJ538mZTrvUq7Ay_ZV/view?usp=share_link" }
        ]
    },

    {
        week: 15,
        type: "learning",
        subject: "NEXT For Autism Learning Week: Mindful Feedback",
        description: "Learn how to give and receive feedback effectively.",
        footer: "You're almost done!",
        items: [
            { icon: "/play.png", text: "Video: Mindful Feedback", link: "https://vimeo.com/1135354938?share=copy&fl=sv&fe=ci" },
            { icon: "/assigment.png", text: "Assignment: Pre-Session Worksheet", link: "https://drive.google.com/file/d/1t9sOL43-NHrC7KDiisl4FnOzWAz5nfTe/view?usp=share_link" },
            { icon: "/assigment.png", text: "Assignment: Schedule a meeting", link: "https://docs.google.com/document/d/1SeVK2SldbBOvKiPOj_XytbAVyohuZKzOylELLOjbCy8/edit?usp=sharing" }
        ]
    },

    {
        week: 16,
        type: "discussion",
        subject: "NEXT For Autism: Final Discussion & Celebration!",
        description: "Final meeting and reflection.",
        footer: "Congratulations — you made it to the final week!",
        items: [
            { icon: "/agenda.png", text: "Agenda: Mindful Feedback Agenda", link: "https://drive.google.com/file/d/1fmy1iLBw__iPwybBces5isywj-oGkLPj/view?usp=share_link" },
            { icon: "/assigment.png", text: "Assignment: Post-Session Worksheet", link: "https://drive.google.com/file/d/1t9sOL43-NHrC7KDiisl4FnOzWAz5nfTe/view?usp=share_link" },
            { icon: "/video.png", text: "Discussion: Meet with your matched professional and reflect", link: "" },
            { icon: "/assigment.png", text: "Assignment: Post-Program Survey", link: "https://docs.google.com/forms/d/e/1FAIpQLScf3Yfwk4XKMWPVf_UbFnj2_Zn32rxyeSDpxqOSQE-a65ctzA/viewform?usp=header" }
        ]
    }
]

const WeeklyMaterials = ({ currentWeek }) => {
    const weeksToShow = currentWeek
        ? weeks.filter(w => w.week <= currentWeek)
        : weeks;
    if (weeksToShow.length === 0) return null;

    return (
        <div className='materials-container'>
            {weeksToShow.map((week) => (
                week.type === "learning"
                    ? <LearningBox key={week.week} week={week} />
                    : <DiscussionBox key={week.week} week={week} />
            ))}
        </div>
    );
}
export default WeeklyMaterials

// const WeeklyMaterials = () => {
//   return (
//     //add a flexbox and grid of 16 weeks
//     //add static resources from google drive
//         //https://docs.google.com/document/d/1kaEbF4LFaL2KlYpK_xpNbnlx1i63OQrKt8YKuQ0xnV8/edit?tab=t.0#heading=h.gpjdwxua4nzq

//         <div className='materials-container'>

//             <div className='material-box'>

//                 <div className='week-bar'>
//                     <p>Week 1</p>
//                     <a href="mailto:example@domain.com">Reminder</a>
//                 </div>

//                 <div>
//                     <p>Subject: NEXT Connects Learning Week: Professional Connection</p>
//                     <p>This week's topic in NEXT Connects is Professional Connection! You'll learn what professional connection means and how it can help you grow—both at work and in life.</p>
//                 </div>
                
//                 <div className='material-description'>
//                     <div className='description-logo'>
//                         <img src = "/play.png" alt="logo" className='logo-sizing'></img>
//                         <a href = "https://vimeo.com/1135356068?share=copy&fl=sv&fe=ci" alt = 'Video: What is Next Connects?'>Video: What is Next Connects?</a>
//                     </div>
//                     <div className='description-logo'>
//                         <img src = "/assigment.png" alt="logo" className='logo-sizing'></img>
//                         <a href = "https://drive.google.com/file/d/1c2MJiC6CA9c8MzLVGlX5x-NElmzK2BJi/view?usp=share_link" alt = 'Professional Communication Guide Assigment PDF'>Assigment: Professional Communication Guide</a>
//                     </div>
//                     <div className='description-logo'>
//                         <img src = "/assigment.png" alt="logo" className='logo-sizing'></img>
//                         <a href = "https://drive.google.com/file/d/1q6_tfUcUk7F3zrtdQgl5SI9Y5UqZpF_g/view?usp=share_link" alt = 'Pre/Post-Session Worksheet Assigment PDF'>Assigment: Pre-Session Worksheet</a>
//                     </div>
//                     <div className='description-logo'>
//                         <img src = "/assigment.png" alt="logo" className='logo-sizing'></img>
//                         <a href = "https://docs.google.com/document/d/1SeVK2SldbBOvKiPOj_XytbAVyohuZKzOylELLOjbCy8/edit?usp=sharing" alt = 'Schedule a meeting Assigment PDF'>Assigment: Schedule a meeting with your matched professional</a>
//                     </div>
//                 </div>

//                 <div>
//                     <p>Next week: You'll finally get to meet your matched professional and start learning together!</p>
//                 </div>

//             </div>


//             <div className='material-box-w-meeting'>

//                 <div className='week-bar-w-meeting'>
//                     <p>Week 2</p>
//                     <a>Meeting Link</a>
//                     <a href="mailto:example@domain.com">Reminder</a>
//                 </div>
    
//                 <div>
//                     <p>Subject: NEXT Connects Discussion Week: Time for Your First Chat!</p>
//                     <p>It's Discussion Week in NEXT Connects — time for your first chat with your matched professional! This is your chance to get to know each other and talk about what you've been learning so far.</p>
//                 </div>

//                 <div className='material-description'>
//                     <div className='description-logo'>
//                         <img src = "/agenda.png" alt="logo" className='logo-sizing'></img>
//                         <a href = "https://drive.google.com/file/d/1NsVmRllVbRohRPS9z0ETwb1Y8CK-KGwi/view?usp=share_link" alt = 'Professional Connection Agenda Assigment PDF'>Agenda: Professional Connection Agenda</a>
//                     </div>
//                     <div className='description-logo'>
//                         <img src = "/video.png" alt="logo" className='logo-sizing'></img>
//                         <a alt = "Meeting Link" >Discussion: Meet with your matched professional</a>
//                     </div>
//                     <div className='description-logo'>
//                         <img src = "/assigment.png" alt="logo" className='logo-sizing'></img>
//                         <a href = "https://drive.google.com/file/d/1q6_tfUcUk7F3zrtdQgl5SI9Y5UqZpF_g/view?usp=share_link" alt = "Post-Session Assigment PDF">Assignment: Post-Session Worksheet</a>
//                     </div>
//                 </div>

//                 <div>
//                     <p>We can't wait to hear how your first meeting goes!</p>
//                 </div>
//             </div>

//             <div className='material-box'>

//                 <div className='week-bar'>
//                     <p>Week 3</p>
//                     <a href="mailto:example@domain.com">Reminder</a>
//                 </div>

//                 <div>
//                     <p>Subject: NEXT Connects Learning Week: Goal Setting</p>
//                     <p>This week's topic for NEXT Connects is Goal Setting! Learn how to create clear and effective goals.</p>
//                 </div>
    
//                 <div className='material-description'>
//                     <div className='description-logo'>
//                         <img src = "/play.png" alt="logo" className='logo-sizing'></img>
//                         <a href="https://vimeo.com/1134698212?share=copy&fl=sv&fe=ci" alt="Goal Setting Video">Video: Goal Setting</a>
//                     </div>
//                     <div className='description-logo'>
//                         <img src = "/assigment.png" alt="logo" className='logo-sizing'></img>
//                         <a href="https://drive.google.com/file/d/1FcELgUl-_mTD1Bn4LI_bcEIpUQZDEC0-/view?usp=share_link" alt="SMART Goals Worksheet PDF">Assignment: SMART Goals Worksheet</a>
//                     </div>
//                     <div className='description-logo'>
//                         <img src = "/assigment.png" alt="logo" className='logo-sizing'></img>
//                         <a href="https://drive.google.com/file/d/1dsPfM6yaejJ533m6kRZPaOZcSlCRxCqO/view?usp=share_link" alt="Pre-Session Worksheet PDF">Assignment: Pre-Session Worksheet</a>
//                     </div>
//                     <div className='description-logo'>
//                         <img src = "/assigment.png" alt="logo" className='logo-sizing'></img>
//                         <a href="https://docs.google.com/document/d/1SeVK2SldbBOvKiPOj_XytbAVyohuZKzOylELLOjbCy8/edit?usp=sharing" alt="Schedule Meeting">Assignment: Schedule a meeting with your matched professional</a>
//                     </div>
//                 </div>

//                 <div>
//                     <p>Next week: you'll share your goals with your matched professional!</p>
//                 </div>

//             </div>

//             <div className='material-box-w-meeting'>

//                 <div className='week-bar-w-meeting'>
//                     <p>Week 4</p>
//                     <a alt="Meeting Link">Meeting Link</a>
//                     <a href="mailto:example@domain.com">Reminder</a>
//                 </div>

//                 <div>
//                     <p>Subject: NEXT Connects Discussion Week: Let's Talk About Your Goals!</p>
//                     <p>This week, meet with your matched professional to talk about your goals.</p>
//                 </div>

//                 <div className='material-description'>
//                     <div className='description-logo'>
//                         <img src = "/assigment.png" alt="logo" className='logo-sizing'></img>
//                         <a href="https://drive.google.com/file/d/1FcELgUl-_mTD1Bn4LI_bcEIpUQZDEC0-/view?usp=share_link" alt="SMART Goals Worksheet">Review: SMART Goals Worksheet</a>
//                     </div>
//                     <div className='description-logo'>
//                         <img src = "/agenda.png" alt="logo" className='logo-sizing'></img>
//                         <a href="https://drive.google.com/file/d/1dWate9NOpJhNtGxMVQxUT4iECp15z-dW/view?usp=share_link" alt="Goal Setting Agenda PDF">Agenda: Goal Setting Agenda</a>
//                     </div>
//                     <div className='description-logo'>
//                         <img src = "/video.png" alt="logo" className='logo-sizing'></img>
//                         <a alt = "Meeting Link" >Discussion: Meet with your matched professional</a>
//                     </div>
//                     <div className='description-logo'>
//                         <img src = "/assigment.png" alt="logo" className='logo-sizing'></img>
//                         <a href="https://drive.google.com/file/d/1dsPfM6yaejJ533m6kRZPaOZcSlCRxCqO/view?usp=share_link" alt="Post-Session Worksheet PDF">Assignment: Post-Session Worksheet</a>
//                     </div>
//                 </div>

//                 <div>
//                     <p>Choose 1-2 goals to focus on together! Remember: good goals are clear and realistic, and help you grow!</p>
//                 </div>

//             </div>

//         </div>
//   )
// }

// export default WeeklyMaterials
