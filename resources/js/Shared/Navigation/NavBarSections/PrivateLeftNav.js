import React, { Fragment, useState } from 'react'
import { Link } from '@inertiajs/inertia-react'
import { Menu, Transition } from '@headlessui/react'
import DropdownTitle from '../../Elements/DropdownTitle'
import dayjs from '../../../Helpers/date.helpers'
import AdminMenu from './AdminMenu'

const PrivateLeftNav = (props) => {
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
    <>
      <div className={props.mobile ? 'px-2 pt-2 pb-3 space-y-1' : 'flex space-x-4'}>
        <Link href="/dashboard" className={props.mobile ? 'nav-link mobile' : 'nav-link'}>My Crew Page</Link>
        <Link href="/airports" className={props.mobile ? 'nav-link mobile' : 'nav-link'}>Airport Search</Link>
        <Menu as="div" className={props.mobile ? 'relative' : 'ml-3 relative'}>
          <div>
            <Menu.Button className={props.mobile ? 'nav-link mobile' : 'nav-link'}>
              <span className="sr-only">Open Bush Divers HQ menu</span>
              <DropdownTitle title="Bush Divers HQ" />
            </Menu.Button>
          </div>
          <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white focus:outline-none">
              <Menu.Item>
                {({ active }) => <Link href="/hubs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Hubs</Link>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <Link href="/roster" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Pilot Roster</Link>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <Link href="/ranks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Ranks and Awards</Link>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <Link href="/finances" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Company Financials</Link>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <a href="https://storage.googleapis.com/bush-divers.appspot.com/Bush%20Divers%20-%20Handbook.pdf" target="_blank" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Pilot Handbook</a>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <a href="https://storage.googleapis.com/bush-divers.appspot.com/BushTracker.zip" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Bush Tracker</a>}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
        <Menu as="div" className={props.mobile ? 'relative' : 'ml-3 relative'}>
          <div>
            <Menu.Button className={props.mobile ? 'nav-link mobile' : 'nav-link'}>
              <span className="sr-only">Open Aircraft menu</span>
              <DropdownTitle title="Aircraft" />
            </Menu.Button>
          </div>
          <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white focus:outline-none">
              <Menu.Item>
                {({ active }) => <Link href="/fleet" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Bush Divers Fleet</Link>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <Link href="/rentals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Aircraft Rentals</Link>}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
        <Menu as="div" className={props.mobile ? 'relative' : 'ml-3 relative'}>
          <div>
            <Menu.Button className={props.mobile ? 'nav-link mobile' : 'nav-link'}>
              <span className="sr-only">Open Contracts</span>
              <DropdownTitle title="Contracts" />
            </Menu.Button>
          </div>
          <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white focus:outline-none">
              <Menu.Item>
                {({ active }) => <Link href="/contracts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Find a Contract</Link>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <Link href="/my-contracts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Contracts {props.auth.user.current_bids > 0 ? <span>({props.auth.user.current_bids})</span> : <span>(0)</span> }</Link>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <Link href="/completed-contracts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Completed Contracts</Link>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <Link href="/dispatch" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Flight Dispatch</Link>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <Link href="/pireps/submit" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Submit Pirep</Link>}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
        <Link href="/live-flights" className={props.mobile ? 'nav-link mobile' : 'nav-link'}>Live Flights Map</Link>
        <span className="nav-link cursor-pointer" onMouseOver={showLocalTime} onMouseLeave={showUTCTime}>{displayDate} {timeFormat}</span>
        {props.auth.user.is_admin ? <AdminMenu /> : null}
      </div>
    </>
  )
}

export default PrivateLeftNav
