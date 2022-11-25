import React, { useState } from 'react'
import { Head, Link, usePage } from '@inertiajs/inertia-react'
import FlashMessage from './Elements/FlashMessage'
import { Toaster } from 'react-hot-toast'
// import OldAppBar from './Layout/OldAppBar'
import AppBar from './Layout/AppBar'

export default function AppLayout ({ children, title, heading }) {
  const { auth } = usePage().props
  const { flash } = usePage().props

  function renderAppBar () {
    return (
      <>
        <Toaster toastOptions={{ style: { marginTop: '4rem' } }} />
        <Head><title>{title}</title></Head>
        <AppBar />
        <div className="mt-20 container mx-auto">
          {flash.error && <FlashMessage type="error" message={flash.error} />}
          {flash.success && <FlashMessage type="success" message={flash.success} />}
          <div className="flex items-center justify-between">
            <h1>{heading}</h1>
            <div className="mr-2 flex items-center space-x-4">
              <span className="hidden md:flex">${parseFloat(auth.user.balance).toLocaleString()}</span>
              <span className="hidden md:flex">{auth.user.points} XP</span>
              <span className="md:hidden">Current Location:</span><span className="link link-primary"><Link href={`/airports/${auth.user.current_airport_id}`}>{auth.user.current_airport_id}</Link></span>
            </div>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </>
    )
  }

  return (
        <>
          {renderAppBar()}
        </>

  )
}
