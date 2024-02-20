import { Head, usePage } from '@inertiajs/react'
import React from 'react'

import FlashMessage from '../elements/FlashMessage'
import Footer from './navigation/public/Footer'
import NavBar from './navigation/public/NavBar'

export default function Layout({ children, title }) {
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
