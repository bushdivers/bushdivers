import React, { useState } from 'react'
import { Head, Link, usePage } from '@inertiajs/inertia-react'
import Footer from './Navigation/Footer'
import FlashMessage from './Elements/FlashMessage'
import AppFooter from './Navigation/AppFooter'
import Header from './Layout/Header'
import SideBar from './Layout/SideBar'
import { Toaster } from 'react-hot-toast'

export default function AppLayout ({ children, title, heading }) {
  const { flash } = usePage().props
  const [isNavVisible, setIsNavVisible] = useState(false)

  const toggleNavBar = () => {
    setIsNavVisible(!isNavVisible)
  }

  return (
        <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800">
          <Toaster toastOptions={{ style: { marginTop: '4rem'}}} />
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
