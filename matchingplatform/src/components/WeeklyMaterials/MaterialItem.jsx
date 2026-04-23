import React from 'react'

const MaterialItem = ({items}) => {
  return (
    <div className='description-logo'>
        <img src={items.icon} alt = "logo" className='logo-sizing'></img>
        <a href = {items.link} alt = {items.text}>{items.text}</a>
    </div>
  )
}

export default MaterialItem
