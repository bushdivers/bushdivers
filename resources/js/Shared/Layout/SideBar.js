import React, { useState } from 'react'
import { Link, usePage } from '@inertiajs/inertia-react'
import NavItem from '../Navigation/NavItem'
import NavSection from '../Navigation/NavSection'

const SideBar = ({ isNavVisible, setNavState }) => {
  const { auth } = usePage().props

  return (
    <aside className={`${isNavVisible ? 'block' : 'hidden'} lg:block overflow-auto sidebar fixed top-0 bottom-0 min-h-screen w-64 lg:shadow transform md:translate-x-0 transition-transform duration-150 ease-in bg-white border-r-2 border-orange-500 z-20`}>
      <div className="sidebar-header flex items-center justify-center py-4">
        <div className="inline-flex items-center">
          <Link href="/" className="inline-flex flex-row items-center">
            <img
              className="h-9 w-auto"
              src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png"
              alt="logo"
            />
            <span className="leading-10 text-gray-900 text-xl ml-2">Bush Divers</span>
          </Link>
          <i onClick={setNavState} className="lg:hidden cursor-pointer ml-2 material-icons">menu_open</i>
        </div>
      </div>
      <div className="sidebar-content px-4 py-2">
        <ul className="flex flex-col w-full">
          <NavItem link="/dashboard" icon="home" text="My Crew Page" />
          <NavItem link="/live-flights" icon="near_me" text="Live Flights" />
          <NavItem link="/airports" icon="business" text="Airports" />
          <NavSection name="HQ" />
          <NavItem link="/roster" icon="people" text="Roster" />
          <NavItem link="/fleet-aircraft" icon="flight" text="Fleet" />
          <NavItem link="/finances" icon="account_balance_wallet" text="Company Finances" />
          <NavItem link="/resources" icon="download" text="Resources" />
          <NavSection name="Contracts" />
          <NavItem link="/available-contracts" icon="assignment_ind" text="Available Contracts" numeric={auth.user.current_bids} />
          <NavItem link="/contracts" icon="assignment" text="Find a Contract" />
          <NavItem link="/completed-contracts" icon="assignment_turned_in" text="Completed Contracts" />
          <NavItem link="/dispatch" icon="assignment_returned" text="Flight Dispatch" />
          <NavSection name="Pilot Area" />
          <NavItem link="/logbook" icon="text_snippet" text="Logbook" />
          <NavItem link="/my-finances" icon="account_balance" text="My Finances" />
          <NavItem link="/jumpseat" icon="airplane_ticket" text="Jumpseat" />
          <NavItem link="/marketplace" icon="flight_takeoff" text="Marketplace" />
          <NavItem link="/logout" icon="lock" text="Sign Out" />
          {auth.user.is_admin
            ? (
              <>
                <NavSection name="Admin" />
                <NavItem link="/admin/pireps" icon="text_snippet" text="Pireps" />
                <NavItem link="/admin/fleet" icon="flight" text="Fleet" />
                <NavItem link="/admin/users" icon="people" text="Users" />
                <NavItem link="/admin/resources" icon="download" text="Resources" />
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
