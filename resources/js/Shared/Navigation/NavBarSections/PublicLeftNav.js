import React from 'react'
import { Link } from '@inertiajs/inertia-react'

const PublicLeftNav = (props) => {
  return (
    <>
      <div className={props.mobile ? 'px-2 pt-2 pb-3 space-y-1' : 'flex space-x-4'}>
        <Link href="/hubs" className={props.mobile ? 'nav-link mobile' : 'nav-link'}>Hubs</Link>
        <Link href="/fleet" className={props.mobile ? 'nav-link mobile' : 'nav-link'}>Fleet</Link>
      </div>
    </>
  )
}

export default PublicLeftNav
