import React, { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Disclosure } from '@headlessui/react'
import { Link } from '@inertiajs/inertia-react'
import PublicLeftNav from './NavBarSections/PublicLeftNav'
import PublicRightNav from './NavBarSections/PublicRightNav'
import { faBurger, faClose } from '@fortawesome/free-solid-svg-icons'

export default function NavBar () {
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
                      <div className="block h-6 w-6" aria-hidden="true"><FontAwesomeIcon icon={faClose} /></div>
                      )
                    : (
                      <div className="block h-6 w-6" aria-hidden="true"><FontAwesomeIcon icon={faBurger} /></div>
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
                  <PublicLeftNav />
                </div>
              </div>
              <div className="hidden sm:block sm:ml-6">
                <PublicRightNav />
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <PublicLeftNav mobile={true} />
            <PublicRightNav mobile={true} />
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
