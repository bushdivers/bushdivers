import React from 'react'
import { Head, Link, usePage } from '@inertiajs/inertia-react'
import NavBar from './Navigation/NavBar'
import Footer from './Navigation/Footer'

export default function Layout ({ children, title }) {
  const { flash } = usePage().props
  return (
        <main className="flex flex-col h-screen z-0">
            <Head title={title} />
            <NavBar />
            {flash.error && <p className="text-red-500">{flash.error}</p>}
            {flash.success && <p className="text-green-500">{flash.success}</p>}
            <div className="flex-grow p-4">{children}</div>
            <Footer />
        </main>
  )
}
