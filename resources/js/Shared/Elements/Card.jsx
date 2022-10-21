import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const Card = ({ children, title, collapsable = false, compact = false }) => {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <div className={`${compact ? '' : 'p-6'} bg-white md:rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700`}>
      <div className="flex items-center content-center justify-between">
        {title && <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h2>}
        {collapsable && (<span className="p-2 cursor-pointer" onClick={() => setCollapsed(!collapsed)}>{collapsed ? <FontAwesomeIcon icon={faChevronRight} /> : <FontAwesomeIcon icon={faChevronDown} />}</span>)}
      </div>
      {collapsable
        ? (
          <>{!collapsed
            ? (<div className="mt-2">{children}</div>)
            : (<></>)
          }</>
          )
        : (<>{children}</>)
      }
    </div>
  )
}

export default Card
