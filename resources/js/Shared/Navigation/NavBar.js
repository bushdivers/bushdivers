import React, { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { usePage, Link } from '@inertiajs/inertia-react'
import PublicLeftNav from './NavBarSections/PublicLeftNav'
import PrivateLeftNav from './NavBarSections/PrivateLeftNav'
import PublicRightNav from './NavBarSections/PublicRightNav'
import PrivateRightNav from './NavBarSections/PrivateRightNav'
import UserName from './NavBarSections/UserName'
import AdminMenu from './NavBarSections/AdminMenu'

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
              <div className="hidden sm:block sm:ml-6">
                {!auth.user ? <PublicRightNav /> : <PrivateRightNav auth={auth} />}
              </div>
            </div>
          </div>
          {!auth.user
            ? (
              <Disclosure.Panel className="sm:hidden">
                <PublicLeftNav mobile={true} />
                <PublicRightNav mobile={true} />
              </Disclosure.Panel>
              )
            : (
              <Disclosure.Panel className="sm:hidden">
                <PrivateLeftNav mobile={true} auth={auth} />
                <PrivateRightNav mobile={true} auth={auth} />
                {auth.user.is_admin && <AdminMenu mobile={true} />}
              </Disclosure.Panel>
              )
          }
        </>
      )}
    </Disclosure>
  )
}
