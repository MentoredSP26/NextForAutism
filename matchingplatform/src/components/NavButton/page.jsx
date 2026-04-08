'use client';
import { useRouter } from "next/navigation";
// import { useState, setState } from 'react'

function NavButton(props) {
    const router=useRouter();

    const handleClick = () => {
        if (!props.path) {
            console.log('No path');
            return;
        } else {
            router.push(props.path)
        }

    }
    return (
        <div>
            {/* <Image alt="button icon"></Image> */}
            <button onClick={handleClick}>{props.text}</button>
        </div>
    )
}

export default NavButton