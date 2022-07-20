import React, { useState } from 'react'
import { Link, usePage } from '@inertiajs/inertia-react'
import dayjs from '../../Helpers/date.helpers'
import Tooltip from '../Elements/Tooltip'
import { faBell, faBurger } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Header = ({ heading, setNavState }) => {
  const { auth } = usePage().props
  const [displayDate, setDisplayDate] = useState(dayjs().utc().format('HH:mm'))
  const [timeFormat, setTimeFormat] = useState('UTC')

  const showLocalTime = () => {
    setDisplayDate(dayjs().format('HH:mm'))
    setTimeFormat('local')
  }

  const showUTCTime = () => {
    setDisplayDate(dayjs().utc().format('HH:mm'))
    setTimeFormat('UTC')
  }

  return (
      <header className="flex flex-row justify-between items-center header fixed bg-white shadow left-0 lg:left-64 right-0 py-4 px-4 z-20">
        <div className="flex items-center">
          <div className="lg:hidden mr-3 cursor-pointer" onClick={setNavState}><FontAwesomeIcon icon={faBurger} /></div>
          <h1>{heading}</h1>
        </div>
        <div className="flex items-center">
          <div className="mr-1 md:mr-4">
            <span className="nav-link cursor-pointer" onMouseOver={showLocalTime} onMouseLeave={showUTCTime}>{displayDate} {timeFormat}</span>
          </div>
          <div className="hidden md:inline-block mr-4">
            <div className="flex items-center">
              <div className="mx-1">
                <Tooltip content="My Finances" direction="bottom">
                  <Link href="/my-finances">
                    ${auth.user.balance.toLocaleString(navigator.language)}
                  </Link>
                </Tooltip>
              </div>
              <div className="mx-1">
                <Tooltip content="My Logbook" direction="bottom">
                  <Link href="/logbook">
                    {auth.user.points.toLocaleString(navigator.language)} XP
                  </Link>
                </Tooltip>
              </div>
              <div className="mx-1">
                <Tooltip content="Current Airport" direction="bottom">
                <Link href={`/airports/${auth.user.current_airport_id}`} className="ml-2 btn cursor-pointer">
                  {auth.user.current_airport_id}
                </Link>
                </Tooltip>
              </div>
              <div className="mx-1">
                <a href="https://bush-divers.releasenotes.io" target="_blank" className="rn-badge" rel="noreferrer">
                  <FontAwesomeIcon icon={faBell} />
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center mx-2">
            <img width="60" className="mr-3" src={auth.user.rank.image} />
            <Tooltip content="Profile" direction="bottom">
            <Link href="/profile">
              <span className="flex flex-col">
                <span className="font-semibold text-orange-500 tracking-wide leading-none">{auth.user.name}</span>
                <span className="text-gray-500 text-xs leading-none mt-1">{auth.user.pilot_id} {auth.user.rank.name}</span>
              </span>
            </Link>
            </Tooltip>
          </div>
        </div>
      </header>
  )
}

export default Header

