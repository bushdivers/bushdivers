import React from 'react'
import { Head, usePage } from '@inertiajs/inertia-react'

export default function LayoutAuth ({ children, title }) {
  const { flash } = usePage().props
  return (
    <div className="h-screen" style={{ backgroundImage: 'url("https://res.cloudinary.com/dji0yvkef/image/upload/v1629364231/BDVA/bg-1_llda6s.jpg")' }}>
      <Head title={title} />
      {flash.error && <p className="text-red-500">{flash.error}</p>}
      {flash.success && <p className="text-green-500">{flash.success}</p>}
      {children}
    </div>
  )
}
