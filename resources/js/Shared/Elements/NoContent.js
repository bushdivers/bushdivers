import React from 'react'

export default function NoContent ({ content }) {
  return (
    <div className="p-3 flex items-center content-center flex-col text-gray-700">
      {content}
    </div>
  )
}
