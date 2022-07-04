import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from '@inertiajs/inertia-react'

const NavItem = ({ text, link, icon, numeric, nativeLink }) => {
  return (
    <li className="my-px">
      {nativeLink
        ? (
          <a
            href={link}
            className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-700 hover:bg-gray-100"
          >
        <span className="flex items-center justify-center text-lg text-gray-400">
          <FontAwesomeIcon icon={icon} />
        </span>
            <span className="ml-3">{text}</span>
            {numeric >= 0 && (
              <span
                className="flex items-center justify-center text-xs text-orange-500 font-semibold bg-orange-100 h-6 px-2 rounded-full ml-auto"
              >{numeric}</span>
            )}
          </a>
          )
        : (
          <Link
            href={link}
            className="flex flex-row items-center h-10 px-3 rounded-lg text-gray-700 hover:bg-gray-100"
          >
        <span className="flex items-center justify-center text-lg text-gray-400">
          <FontAwesomeIcon icon={icon} />
        </span>
            <span className="ml-3">{text}</span>
            {numeric >= 0 && (
              <span
                className="flex items-center justify-center text-xs text-orange-500 font-semibold bg-orange-100 h-6 px-2 rounded-full ml-auto"
              >{numeric}</span>
            )}
          </Link>
          )
      }
    </li>
  )
}

export default NavItem
