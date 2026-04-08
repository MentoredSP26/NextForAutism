'use client';
import { useRouter } from "next/navigation";
// import { useState, setState } from 'react'

function NavButton(props) {
    const router=useRouter();
    return (
        <div>
            {/* <Image alt="button icon"></Image> */}
            <button onClick={() => router.push(props.path)}>{props.text}</button>
        </div>
    )
}

export default NavButton