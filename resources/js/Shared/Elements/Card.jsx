import React from 'react'

const Card = ({ children, title, center, slimline = false }) => {
  return (
    <div className="card w-full bg-neutral shadow-xl">
      <div className={`card-body ${slimline ? 'p-3' : ''}`}>
        {title && <h2 className="card-title">{title}</h2>}
        <div className={`${center ? 'flex items-center justify-center' : ''}`}>{children}</div>
      </div>
    </div>
  )
}

export default Card
