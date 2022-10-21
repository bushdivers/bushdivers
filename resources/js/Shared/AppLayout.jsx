import React, { useState } from 'react'
import { Head, usePage } from '@inertiajs/inertia-react'
import FlashMessage from './Elements/FlashMessage'
import Header from './Layout/Header'
import SideBar from './Layout/SideBar'
import { Toaster } from 'react-hot-toast'
import { useFlags } from 'flagsmith/react'
import AppBar from './Layout/AppBar'


export default function AppLayout ({ children, title, heading }) {
  const flags = useFlags(['new_layout'])
  const { flash } = usePage().props
  const [isNavVisible, setIsNavVisible] = useState(false)

  const toggleNavBar = () => {
    setIsNavVisible(!isNavVisible)
  }

  function renderAppBar () {
    if (flags.new_layout.enabled) {
      return (
        <>
          <Toaster toastOptions={{ style: { marginTop: '4rem' } }} />
          <Head><title>{title}</title></Head>
          <AppBar />
          <div className="mt-20 container mx-auto">
            {flash.error && <FlashMessage type="error" message={flash.error} />}
            {flash.success && <FlashMessage type="success" message={flash.success} />}
            <h1>{heading}</h1>
            <div className="mt-4">{children}</div>
          </div>
        </>
      )
    } else {
      return (
        <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800">
          <Toaster toastOptions={{ style: { marginTop: '4rem' } }} />
          <Head title={title} />
          <SideBar isNavVisible={isNavVisible} setNavState={toggleNavBar} />
          <main className="main flex flex-col flex-grow -ml-64 lg:ml-0 transition-all duration-150 ease-in z-10">
            <Header heading={heading} setNavState={toggleNavBar} />
            <div className="main-content flex flex-col flex-grow relative ml-64 mt-16">
              {flash.error && <FlashMessage type="error" message={flash.error} />}
              {flash.success && <FlashMessage type="success" message={flash.success} />}
              {children}
            </div>
          </main>
        </div>
      )
    }
  }

  return (
        <>
          {renderAppBar()}
        </>

  )
}
