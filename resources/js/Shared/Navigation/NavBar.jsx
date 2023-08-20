import React from 'react'
import { Link, usePage } from '@inertiajs/inertia-react'

export default function NavBar () {
  const { auth } = usePage().props
  return (
    <div className="navbar bg-neutral fixed w-full top-0 z-20 border-b">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-neutral rounded-box w-52">
            <li><Link href="/login" className="btn btn-primary mt-2">Crew Login</Link></li>
            <li><Link href="/register" className="btn btn-secondary mt-2">Get started</Link></li>
          </ul>
        </div>
        <a className="btn btn-ghost normal-case text-xl">
          <img src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png" className="mr-3 h-6 sm:h-9" alt="Bush Divers Logo" />
          <h4>Bush Divers</h4>
        </a>
      </div>
      <div className="navbar-end">
        {!auth.user && (
          <>
            <Link href="/login" className="btn btn-primary hidden lg:flex mr-2">Crew Login</Link>
            <Link href="/register" className="btn btn-secondary hidden lg:flex">Get started</Link>
          </>
        )}
      </div>
    </div>
  )
}
