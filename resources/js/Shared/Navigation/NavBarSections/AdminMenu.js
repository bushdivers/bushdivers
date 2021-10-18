import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import DropdownTitle from '../../Elements/DropdownTitle'
import { Link } from '@inertiajs/inertia-react'

const AdminMenu = (props) => {
  return (
    <div>
      <Menu as="div" className={props.mobile ? 'relative' : 'ml-3 relative'}>
        <div>
          <Menu.Button className={props.mobile ? 'nav-link mobile' : 'nav-link'}>
            <span className="sr-only">Open Admin menu</span>
            <DropdownTitle title="Admin" />
          </Menu.Button>
        </div>
        <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white focus:outline-none">
            <Menu.Item>
              {({ active }) => <Link href="/admin/pireps" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Pireps</Link>}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => <Link href="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Users</Link>}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => <Link href="/fleet" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Fleet</Link>}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default AdminMenu
