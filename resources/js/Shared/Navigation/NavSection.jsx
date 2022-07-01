import React from 'react'

const NavSection = ({ name }) => {
  return (
    <li className="my-px">
      <span className="flex font-medium text-sm text-gray-300 px-4 my-2 uppercase">{name}</span>
    </li>
  )
}

export default NavSection
