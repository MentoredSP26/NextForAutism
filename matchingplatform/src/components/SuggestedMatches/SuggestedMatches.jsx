import React from 'react'

const SuggestedMatches = () => {
  return (
    <div>
        <div className='one-suggested-match-box'>
            <p>Match #N</p>
            <p>Aspiring profile pic</p>

            <div className='name-&-skills'>
                <h4>Aspiring Name</h4>
                <p>Field - School - Interest</p>
            </div>

            <div className='attribute-match'>
                <p>N% Compatibility</p>
                <p>Attribute</p>
                <p>(Description of Attribute)</p>
            </div>
            
            <p>Established profile pic</p>

            <div className='name-&-skills'>
                <h4>Established Name</h4>
                <p>Field - School - Interest</p>
            </div>

            <div className='dissaprove-suggestion'>
                <button> X </button>
            </div>

            <div className='accept-suggestion'>
                <button>(Check Mark) Approve</button>
            </div>
        </div>
      
    </div>
  )
}

export default SuggestedMatches