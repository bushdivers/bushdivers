import React from 'react'

const Badge = ({ label, color = 'neutral' }) => {
  return (
    <span data-testid="badge" className={`badge badge-${color}`}>{label}</span>
  )
}

export default Badge
