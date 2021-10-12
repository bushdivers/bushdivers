import React from 'react'
import { Link } from '@inertiajs/inertia-react'

const PublicRightNav = (props) => {
  return (
    <>
      <div className={props.mobile ? 'relative mb-4 ml-2' : 'absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'}>
        <Link href="/register" className="btn btn-secondary mr-2">Join Us</Link>
        <Link href="/login" className="btn btn-primary">Crew Login</Link>
      </div>
    </>
  )
}

export default PublicRightNav
