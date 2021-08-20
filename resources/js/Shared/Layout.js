import React from 'react'
import { Head, usePage } from '@inertiajs/inertia-react'
import NavBar from './Navigation/NavBar'

export default function Layout ({ children, title }) {
  const { flash } = usePage().props
  return (
        <main className="flex flex-col h-screen">
            <Head title={title} />
            <NavBar />
            {flash.error && <p className="text-red-500">{flash.error}</p>}
            {flash.success && <p className="text-green-500">{flash.success}</p>}
            <div className="flex-grow p-4">{children}</div>
            <footer>Test</footer>
        </main>
  )
}
