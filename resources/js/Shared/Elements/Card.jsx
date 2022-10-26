import React from 'react'

const Card = ({ children, title, center }) => {
  return (
    <div className="card w-full bg-neutral shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <div className={`${center ? 'flex items-center justify-center' : ''}`}>{children}</div>
      </div>
    </div>
  )
}

export default Card
