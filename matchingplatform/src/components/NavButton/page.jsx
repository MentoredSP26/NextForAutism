'use client';
import { useRouter } from "next/navigation";
// import { useState, setState } from 'react'
import './styles.css';


function NavButton({ page, path, icon }) {

    // const router=useRouter();

    // const handleClick = () => {
    //     if (!props.path) {
    //         console.log('No path');
    //         return;
    //     } else {
    //         router.push(props.path)
    //     }

    // }
    // return (
    //     <div className="nav-button">
    //         {/* <Image alt="button icon"></Image> */}
    //         <button className="button" onClick={handleClick}>{props.text}</button>
    //     </div>
    // )
    return (
        <li className="button">
            <a className="nav-button" href={path}>
                <div className="content">
                    <img className="nav-logo" alt="icon" src={icon}/>
                    <span className="button-text">{page}</span>
                </div>
            </a>
        </li>
    )
}

export default NavButton