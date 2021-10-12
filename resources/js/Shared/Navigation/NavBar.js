import React, { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { usePage, Link } from '@inertiajs/inertia-react'
import PublicLeftNav from './NavBarSections/PublicLeftNav'
import PrivateLeftNav from './NavBarSections/PrivateLeftNav'
import PublicRightNav from './NavBarSections/PublicRightNav'
import PrivateRightNav from './NavBarSections/PrivateRightNav'

export default function NavBar () {
  const { auth } = usePage().props

  return (
    <Disclosure as="nav" className="bg-white border-b-2 border-orange-500 shadow-sm z-10">
      {({ open }) => (
        <>
          <div className="px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-50">
                  <span className="sr-only">Open main menu</span>
                  {open
                    ? (
                      <div className="block h-6 w-6" aria-hidden="true"><i className="material-icons">close</i></div>
                      )
                    : (
                      <div className="block h-6 w-6" aria-hidden="true"><i className="material-icons">menu</i></div>
                      )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/">
                    <img
                      className="block lg:hidden h-9 w-auto"
                      src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png"
                      alt="Workflow"
                    />
                  </Link>
                  <Link href="/">
                    <img
                      className="hidden lg:block h-9 w-auto"
                      src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png"
                      alt="Workflow"
                    />
                  </Link>
                  <span className="hidden lg:block ml-3">Bush Divers</span>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  {!auth.user ? <PublicLeftNav /> : <PrivateLeftNav auth={auth} />}
                </div>
              </div>
                {!auth.user ? <PublicRightNav /> : <PrivateRightNav auth={auth} />}
            </div>
          </div>
          {!auth.user
            ? (
              <Disclosure.Panel className="sm:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <a href="" className="nav-link mobile">How we work</a>
                  <Link href="/staff" className="nav-link mobile">Bush Divers Team</Link>
                  <Link href="/liveflights" className="nav-link mobile">Live Map</Link>
                  <Link href="/hubs" className="nav-link mobile">Hubs</Link>
                  <Link href="/fleet" className="nav-link mobile">Fleet</Link>
                </div>
              </Disclosure.Panel>
              )
            : (
              <Disclosure.Panel className="sm:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link href="/dashboard" className="nav-link mobile">My Crew Page</Link>
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="nav-link mobile">
                        <span className="sr-only">Open Bush Divers HQ menu</span>
                        Bush Divers HQ
                      </Menu.Button>
                    </div>
                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                      <Menu.Items className="z-10 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white focus:outline-none">
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
                          {({ active }) => <Link href="/ranks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Ranks & Awards</Link>}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Pilot Handbook</a>}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Downloads</a>}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="nav-link mobile">
                        <span className="sr-only">Open Contracts menu</span>
                        Contracts
                      </Menu.Button>
                    </div>
                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                      <Menu.Items className="z-10 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white focus:outline-none">
                        <Menu.Item>
                          {({ active }) => <Link href="/contracts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Find a Contract</Link>}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => <Link href="/my-contracts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Contracts</Link>}
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
                  <Link href="/live-flights" className="nav-link mobile">Live Flights</Link>
                </div>
              </Disclosure.Panel>
              )
          }
        </>
      )}
    </Disclosure>
  )
}
