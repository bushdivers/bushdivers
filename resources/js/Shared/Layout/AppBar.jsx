import React, { useState } from 'react'
import ThemeSwitcher from '../Elements/ThemeSwitcher'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import Avatar from '../Elements/Avatar'
import { Link, usePage } from '@inertiajs/inertia-react'
import TextInput from '../Elements/Forms/TextInput'
import { Inertia } from '@inertiajs/inertia'

const MenuItems = ({ mobile }) => {
  return (
    <>
      <li><Link href="/live-flights">Live Flights</Link></li>
      <li><Link href="/dispatch">Flight Dispatch</Link></li>
      <li tabIndex={0}>
        <a className="justify-between">
          Bush Divers HQ
          {mobile ? <FontAwesomeIcon icon={faChevronRight} /> : <FontAwesomeIcon icon={faChevronDown} /> }
        </a>
        <ul className="p-2 bg-neutral">
          <li><Link href="/roster">Roster</Link></li>
          <li><Link href="/fleet-aircraft">Fleet</Link></li>
          <li><Link href="/hubs">Hubs</Link></li>
          <li><Link href="#">Airline Stats - Coming soon</Link></li>
          <li><Link href="/finances">Finances</Link></li>
          <li><a href="https://bushdivers-resource.s3.amazonaws.com/bush-tracker/BushTracker.zip">Bush Tracker</a></li>
        </ul>
      </li>
      <li tabIndex={0}>
        <a className="justify-between">
          Contracts
          {mobile ? <FontAwesomeIcon icon={faChevronRight} /> : <FontAwesomeIcon icon={faChevronDown} /> }
        </a>
        <ul className="p-2 bg-neutral">
          <li><Link href="/available-contracts">Available Contracts</Link></li>
          <li><Link href="/completed-contracts">Completed Contracts</Link></li>
        </ul>
      </li>
      <li tabIndex={0}>
        <a className="justify-between">
          Crew Area
          {mobile ? <FontAwesomeIcon icon={faChevronRight} /> : <FontAwesomeIcon icon={faChevronDown} /> }
        </a>
        <ul className="p-2 bg-neutral">
          <li><Link href="/dashboard">My Crew Page</Link></li>
          <li><Link href="/logbook">My Logbook</Link></li>
          <li><Link href="/my-aircraft">My Aircraft</Link></li>
          <li><Link href="/my-finances">My Finances</Link></li>
          <li><Link href="/jumpseat">Jumpseat</Link></li>
          <li><Link href="/profile">My Profile</Link></li>
          <li><Link href="/logout">Sign Out</Link></li>
        </ul>
      </li>
    </>
  )
}

const AppBar = () => {
  const { auth } = usePage().props
  const [icao, setIcao] = useState('')

  function handleChange (e) {
    setIcao(e.target.value)
  }

  function redirectToAirport () {
    Inertia.get(`/airports/${icao}`)
    setIcao('')
  }

  return (
    <div className="navbar bg-neutral fixed w-full top-0 z-20">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-neutral rounded-box w-52">
            <MenuItems mobile={true} />
            <span className="ml-2 flex items-center">
            <TextInput inline id="icao" onChange={handleChange} type="text" placeHolder="ICAO" value={icao} />
            <button onClick={() => redirectToAirport()} className="btn btn-primary btn-sm ml-2">Search</button>
          </span>
          </ul>
        </div>
        <a className="btn btn-ghost normal-case text-xl">
          <img src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png" className="mr-3 h-6 sm:h-9" alt="Bush Divers Logo" />
          <h4>Bush Divers</h4>
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">
          <MenuItems mobile={false} />
          <span className="ml-2 flex items-center">
            <TextInput inline id="icao" onChange={handleChange} type="text" placeHolder="Enter ICAO" value={icao} />
            <button onClick={() => redirectToAirport()} className="btn btn-primary btn-sm ml-2">Search</button>
          </span>
        </ul>
      </div>
      <div className="navbar-end flex space-x-3">
        <div className="mr-2 flex items-center space-x-4">
          <span className="md:flex">${parseFloat(auth.user.balance).toLocaleString()}</span>
          <span className="hidden md:flex">{auth.user.points} XP</span>
          <span className="link link-primary"><Link href={`/airports/${auth.user.current_airport_id}`}>{auth.user.current_airport_id}</Link></span>
        </div>
        <ThemeSwitcher />
        <Avatar name={auth.user.name} />
        <span className="flex flex-col">
          <span className="font-semibold text-primary tracking-wide leading-none">{auth.user.pilot_id}</span>
          <span className="text-xs leading-none mt-1">{auth.user.rank.name}</span>
        </span>
      </div>
    </div>
  )
}

export default AppBar
