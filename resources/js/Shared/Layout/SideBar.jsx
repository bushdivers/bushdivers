import React, { useState } from 'react'
import { Link, usePage } from '@inertiajs/inertia-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NavItem from '../Navigation/NavItem'
import NavSection from '../Navigation/NavSection'
import {
  faAnglesLeft,
  faBook,
  faCartFlatbedSuitcase,
  faClipboard,
  faClipboardCheck,
  faClipboardQuestion,
  faClipboardUser,
  faCoins,
  faDownload,
  faFileLines,
  faHouse,
  faPaperPlane,
  faPlaneDeparture,
  faPlaneUp,
  faRightToBracket,
  faTicket,
  faUsers,
  faWallet
} from '@fortawesome/free-solid-svg-icons'

const SideBar = ({ isNavVisible, setNavState }) => {
  const { auth } = usePage().props

  return (
    <aside className={`${isNavVisible ? 'block' : 'hidden'} lg:block overflow-auto sidebar fixed top-0 bottom-0 min-h-screen w-64 lg:shadow transform md:translate-x-0 transition-transform duration-150 ease-in bg-white border-r-2 border-orange-500 z-20`}>
      <div className="sidebar-header flex items-center justify-between px-8 py-4">
        <div className="inline-flex items-center">
          <Link href="/" className="inline-flex flex-row items-center justify-center">
            <img
              className="h-10 w-auto"
              src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png"
              alt="logo"
            />
          </Link>
        </div>
        <FontAwesomeIcon onClick={setNavState} icon={faAnglesLeft} className="lg:hidden cursor-pointer ml-2" />
      </div>
      <div className="sidebar-content px-4 py-2">
        <ul className="flex flex-col w-full">
          <NavItem link="/dashboard" icon={faHouse} text="Crew Page" />
          <NavItem link="/live-flights" icon={faPaperPlane} text="Live Flights" />
          <NavItem link="/airports" icon={faCartFlatbedSuitcase} text="Airports" />
          <NavSection name="HQ" />
          <NavItem link="/roster" icon={faUsers} text="Roster" />
          <NavItem link="/fleet-aircraft" icon={faPlaneUp} text="Fleet" />
          <NavItem link="/finances" icon={faCoins} text="Finances" />
          <NavItem link="https://storage.googleapis.com/bush-divers.appspot.com/BushTracker.zip" icon={faDownload} text="Bush Tracker" nativeLink={true} />
          {auth.user.user_roles.includes('resource_manager') ? <NavItem link="/resources" icon={faDownload} text="Resources" /> : <></>}
          <NavSection name="Contracts" />
          <NavItem link="/available-contracts" icon={faClipboardUser} text="Contracts" numeric={auth.user.current_bids} />
          <NavItem link="/contracts" icon={faClipboardQuestion} text="Contract Search" />
          <NavItem link="/completed-contracts" icon={faClipboardCheck} text="Completed" />
          <NavItem link="/dispatch" icon={faClipboard} text="Flight Dispatch" />
          <NavSection name="Pilot Area" />
          <NavItem link="/logbook" icon={faBook} text="Logbook" />
          <NavItem link="/my-finances" icon={faWallet} text="My Finances" />
          <NavItem link="/jumpseat" icon={faTicket} text="Jumpseat" />
          <NavItem link="/my-aircraft" icon={faPlaneDeparture} text="My Aircraft" />
          <NavItem link="/logout" icon={faRightToBracket} text="Sign Out" />
          {auth.user.is_admin
            ? (
              <>
                <NavSection name="Admin" />
                <NavItem link="/admin/pireps" icon={faFileLines} text="Pireps" />
                {/*<NavItem link="/admin/fleet" icon={faPlaneUp} text="Fleet" />*/}
                {/*<NavItem link="/admin/users" icon={faUsers} text="Users" />*/}
                <NavItem link="/admin/resources" icon={faDownload} text="Resources" />
              </>
              )
            : <></>
          }
        </ul>
      </div>
    </aside>
  )
}

export default SideBar
