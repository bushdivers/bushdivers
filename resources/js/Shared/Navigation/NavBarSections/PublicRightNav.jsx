import React from 'react'
import { Link, usePage } from '@inertiajs/inertia-react'
import Avatar from '../../Elements/Avatar'

const PublicRightNav = (props) => {
  const { auth } = usePage().props
  return (
    <>
      {
        auth.user
          ? (
            <div className="flex items-center">
              <div><Link className="link mr-2" href="/dashboard">Return to App</Link></div>
              <div className="mr-2 flex items-center space-x-2">
                <Avatar name={auth.user.name} />
                <span className="flex flex-col">
                <span className="font-semibold text-orange-500 tracking-wide leading-none">{auth.user.pilot_id}</span>
                <span className="text-xs leading-none mt-1">{auth.user.rank.name}</span>
              </span>
              </div>
            </div>
            )
          : (
            <div className={props.mobile ? 'relative mb-4 ml-2' : 'absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'}>
              <Link href="/register" className="btn btn-secondary mr-2">Join Us</Link>
              <Link href="/login" className="btn btn-primary">Crew Login</Link>
            </div>
            )
      }
    </>
  )
}

export default PublicRightNav
