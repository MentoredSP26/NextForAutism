"use client";
import React from "react";
import './style.css';

function Dropdown({label, instruction, options}) {
  return (
    <div>
      <div>
        <p>{instruction}</p>
      </div>
      <div>
        <select id="dropdown" defaultValue="">
          <option value="" disabled hidden>{label}</option>
          {options.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Dropdown;
//function CreateMatch(){
    //<button onClick={() => RUN FUNCTION TO ACTUALLY MATCH)}>Create Match</button>
//}



