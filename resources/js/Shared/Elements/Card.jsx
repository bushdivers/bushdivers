import React from 'react'

export default function Card ({ title, content }) {
  return (
    <div className="bg-white rounded shadow p-4 my-4">
      {title && <div className="text-2xl border-b pb-2">{title}</div>}
      <div>{content && content}</div>
    </div>
  )
}
