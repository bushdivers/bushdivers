import React from 'react'
import { Head, usePage } from '@inertiajs/inertia-react'
import FlashMessage from './Elements/FlashMessage'
import { Toaster } from 'react-hot-toast'
// import OldAppBar from './Layout/OldAppBar'
import AppBar from './Layout/AppBar'

export default function AppLayout ({ children, title, heading, fullSize = false }) {
  const { flash } = usePage().props

  function renderAppBar () {
    return (
      <>
        <Toaster toastOptions={{ style: { marginTop: '4rem' } }} />
        <Head><title>{title}</title></Head>
        <AppBar />
        <div className={`${!fullSize ? 'mt-20 mx-8' : 'mt-16'}`}>
          {flash.error && <FlashMessage type="error" message={flash.error} />}
          {flash.success && <FlashMessage type="success" message={flash.success} />}
          <div className="flex items-center justify-between">
            {!fullSize
              ? (
                <>
                <h1>{heading}</h1>
                </>
                )
              : (
                <></>
                )}
          </div>
          <div className={!fullSize && 'mt-4'}>{children}</div>
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
