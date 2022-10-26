import React, { useEffect, useState } from 'react'

const Avatar = ({ name }) => {
  const [initials, setInitials] = useState('')

  useEffect(() => {
    const i = name.split(' ').map(x => x[0]).join('')
    setInitials([i[0], i[i.length - 1]].join(''))
  }, [name])

  return (
    <div className="avatar placeholder">
      <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
        <span>{initials}</span>
      </div>
    </div>
  )
}

export default Avatar
