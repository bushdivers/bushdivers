import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Link } from '@inertiajs/inertia-react'
import UserName from './UserName'

const PrivateRightNav = (props) => {
  return (
    <>
      <div className={props.mobile ? 'px-2 pt-2 pb-3 space-y-1' : 'absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'}>
        {/* <button */}
        {/*  type="button" */}
        {/*  className="p-1 rounded-full text-gray-700 hover:bg-gray-50 focus:outline-none hidden lg:block" */}
        {/* > */}
        {/*  <span className="sr-only">View notifications</span> */}
        {/*  <div className="h-6 w-6" aria-hidden="true"><i className="material-icons">notifications</i></div> */}
        {/* </button> */}

        <Menu as="div" className={props.mobile ? 'relative' : 'mx-3 relative'}>
          <div>
            <Menu.Button className="flex items-center text-sm hover:bg-gray-50 rounded-xl py-2 px-1">
              <span className="sr-only">Open user menu</span>
              <div className="flex items-center">{props.auth.user && <UserName auth={props.auth} />} <i className="material-icons md-18">expand_more</i></div>
            </Menu.Button>
          </div>
          <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white focus:outline-none">
              <Menu.Item>
                {({ active }) => <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 lg:hidden">NOTAMs</a>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <Link href="/logbook" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Logbook</Link>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Finances</a>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <Link href="/jumpseat" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Jumpseat</Link>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => <Link href="/logout" className="block px-4 py-2 pt-4 border-t text-sm text-gray-700 hover:bg-gray-50 border-t">Sign out</Link>}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>
  )
}

export default PrivateRightNav
