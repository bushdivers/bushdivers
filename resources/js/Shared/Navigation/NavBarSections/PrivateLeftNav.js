import React, { Fragment } from 'react'
import { Link } from '@inertiajs/inertia-react'
import { Menu, Transition } from '@headlessui/react'
import DropdownTitle from '../../Elements/DropdownTitle'

const PrivateLeftNav = (props) => {
  return (
    <>
      <div className={props.mobile ? 'px-2 pt-2 pb-3 space-y-1' : 'flex space-x-4'}>
        <Link href="/dashboard" className={props.mobile ? 'nav-link mobile' : 'nav-link'}>My Crew Page</Link>
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
                {({ active }) => <Link href="/fleet" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Fleet</Link>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <Link href="/roster" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Pilot Roster</Link>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <Link href="/ranks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Ranks and Awards</Link>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Company Financials</a>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Pilot Handbook</a>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Bush Tracker</a>}
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
            </Menu.Items>
          </Transition>
        </Menu>
        <Link href="/live-flights" className={props.mobile ? 'nav-link mobile' : 'nav-link'}>Live Flights Map</Link>
      </div>
    </>
  )
}

export default PrivateLeftNav
