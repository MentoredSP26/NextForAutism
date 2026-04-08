import React from "react";


function Dropdown({ label, instruction, options }) {
  return (
    <div>
      <div>
        <p>{instruction}</p>
      </div>
      <div>
        <label htmlFor="dropdown">Choose {label} </label>
        <select id="dropdown">
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

function CreateMatch(){
    //<button onClick={() => RUN FUNCTION TO ACTUALLY MATCH)}>Create Match</button>
}



