import React from 'react'
import { Head, Link, usePage } from '@inertiajs/inertia-react'
import NavBar from './Navigation/NavBar'
import Footer from './Navigation/Footer'
import FlashMessage from './Elements/FlashMessage'

export default function Layout ({ children, title }) {
  const { flash } = usePage().props
  return (
        <main className="flex flex-col h-screen z-0">
            <Head title={title} />
            <NavBar />
            {flash.error && <FlashMessage type="error" message={flash.error} />}
            {flash.success && <FlashMessage type="success" message={flash.success} />}
            <div className="flex-grow p-4">{children}</div>
            <Footer />
        </main>
  )
}
