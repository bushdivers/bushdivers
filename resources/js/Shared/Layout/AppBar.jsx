import React, { useState } from 'react'
import { Link } from '@inertiajs/inertia-react'
import ThemeSwitcher from '../Elements/ThemeSwitcher'

const AppBar = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [showHQ, setShowHQ] = useState(false)
  const [showDispatch, setShowDispatch] = useState(false)
  const [showCrew, setShowCrew] = useState(false)

  return (
    <nav
      className="bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <Link href="/dashboard" className="flex items-center">
          <img src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png" className="mr-3 h-6 sm:h-9" alt="Bush Divers Logo" />
          <h4 className="hidden md:flex">Bush Divers</h4>
        </Link>
        <div className="flex items-center md:order-2">
          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
            <div className="mr-2">Test</div>
          </div>
          <button onClick={() => setShowMenu(!showMenu)} data-collapse-toggle="navbar-sticky" type="button"
                  className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  aria-controls="navbar-sticky" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                 xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
        <div className={`${!showMenu ? 'hidden' : ''} justify-between items-center w-full md:flex md:w-auto md:order-1 z-10`} id="mega-menu-full">
          <ul
            className="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a href="#"
                 className="block py-2 pr-4 pl-3 rounded md:bg-transparent text-gray-700 md:p-0 dark:text-white">Live Flights</a>
            </li>
            <li onClick={() => setShowHQ(!showHQ)}>
              <button id="mega-menu-full-dropdown-button" data-collapse-toggle="mega-menu-full-dropdown"
                      className="flex justify-between items-center py-2 pr-4 pl-3 w-full font-medium text-gray-700 border-b border-gray-100 md:w-auto hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-gray-400 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700">HQ <svg
                className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"></path>
              </svg>
              </button>
            </li>
            <li onClick={() => setShowDispatch(!showDispatch)}>
              <button id="mega-menu-full-dropdown-button" data-collapse-toggle="mega-menu-full-dropdown"
                      className="flex justify-between items-center py-2 pr-4 pl-3 w-full font-medium text-gray-700 border-b border-gray-100 md:w-auto hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-gray-400 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700">Dispatch <svg
                className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"></path>
              </svg>
              </button>
            </li>
            <li onClick={() => setShowCrew(!showCrew)}>
              <button id="mega-menu-full-dropdown-button" data-collapse-toggle="mega-menu-full-dropdown"
                      className="flex justify-between items-center py-2 pr-4 pl-3 w-full font-medium text-gray-700 border-b border-gray-100 md:w-auto hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-gray-400 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700">Crew <svg
                className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"></path>
              </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
      {/* HQ Menu */}
      <div id="mega-menu-full-dropdown"
           className={`${!showHQ ? 'hidden' : ''} mt-1 bg-white border-gray-200 shadow-sm border-y dark:bg-gray-800 dark:border-gray-600 z-10`}>
        <div
          className="grid py-5 px-4 mx-auto max-w-screen-xl text-gray-900 dark:text-white sm:grid-cols-2 md:grid-cols-3 md:px-6">
          <ul aria-labelledby="mega-menu-full-dropdown-button">
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="font-semibold">Roster</div>
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">See a list of all Bush Divers pilots</span>
              </a>
            </li>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="font-semibold">Fleet</div>
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">Current Fleet information and aircraft status</span>
              </a>
            </li>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="font-semibold">Hubs</div>
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">Current Hub information and stats</span>
              </a>
            </li>
          </ul>
          <ul>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="font-semibold">Airline Stats</div>
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">Airlines stats and leaderboards</span>
              </a>
            </li>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="font-semibold">Finances</div>
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">Airline financial information</span>
              </a>
            </li>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="font-semibold">Bush Tracker</div>
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">Download Bush Tracker - our custom flight tracker</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* Dispatch menu */}
      <div id="mega-menu-full-dropdown-dispatch"
           className={`${!showDispatch ? 'hidden' : ''} mt-1 bg-white border-gray-200 shadow-sm border-y dark:bg-gray-800 dark:border-gray-600`}>
        <div
          className="grid py-5 px-4 mx-auto max-w-screen-xl text-gray-900 dark:text-white sm:grid-cols-2 md:grid-cols-3 md:px-6">
          <ul aria-labelledby="mega-menu-full-dropdown-button">
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="font-semibold">My Flight</div>
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">Plan your next flight and create a dispatch</span>
              </a>
            </li>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="font-semibold">Available Contracts</div>
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">View contracts that are current available to fly</span>
              </a>
            </li>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="font-semibold">Completed Contracts</div>
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">View contracts that have been completed</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* Crew Menu */}
      <div id="mega-menu-full-dropdown-crew"
           className={`${!showCrew ? 'hidden' : ''} mt-1 bg-white border-gray-200 shadow-sm border-y dark:bg-gray-800 dark:border-gray-600`}>
        <div
          className="grid py-5 px-4 mx-auto max-w-screen-xl text-gray-900 dark:text-white sm:grid-cols-2 md:grid-cols-3 md:px-6">
          <ul aria-labelledby="mega-menu-full-dropdown-button">
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="font-semibold">My Crew Page</div>
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">Your own dashboard, stats about your Bush Divers history</span>
              </a>
            </li>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="font-semibold">Logbook</div>
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">A record of all your flights on Bush Divers</span>
              </a>
            </li>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="font-semibold">Aircraft</div>
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">See your private aircraft and access the Marketplace</span>
              </a>
            </li>
          </ul>
          <ul>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="font-semibold">My Finances</div>
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">Details of your finances</span>
              </a>
            </li>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="font-semibold">Loans</div>
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">Apply for a loan to help with purchasing private aircraft</span>
              </a>
            </li>
            <li>
              <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="font-semibold">Jumpseat</div>
                <span className="text-sm font-light text-gray-500 dark:text-gray-400">Move your pilot around the world</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default AppBar
