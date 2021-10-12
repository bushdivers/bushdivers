import React from 'react'
import { Link } from '@inertiajs/inertia-react'

const PublicLeftNav = () => {
  return (
    <>
      <div className="flex space-x-4">
        <a href="" className="nav-link">How we work</a>
        <Link href="/staff" className="nav-link">Bush Divers Team</Link>
        <Link href="/live-flights" className="nav-link">Live Map</Link>
        <Link href="/hubs" className="nav-link">Hubs</Link>
        <Link href="/fleet" className="nav-link">Fleet</Link>
      </div>
    </>
  )
}

export default PublicLeftNav
