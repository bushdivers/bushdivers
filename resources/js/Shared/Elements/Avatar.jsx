import React, { useEffect, useState } from 'react'

const Avatar = ({ name }) => {
  const [initials, setInitials] = useState('')

  useEffect(() => {
    const i = name.split(' ').map(x => x[0]).join('')
    setInitials([i[0], i[i.length - 1]].join(''))
  }, [name])

  return (
    <div className="flex items-center justify-center bg-gray-600 rounded-full w-10 h-10" data-testid="avatar">
      <span className="text-lg text-gray-100">{initials}</span>
    </div>
  )
}

export default Avatar
