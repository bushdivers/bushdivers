import React from 'react'
import { Link } from '@inertiajs/inertia-react'

const Footer = () => {
  const date = new Date().getFullYear()

  return (
    <footer>
      <div className="bg-gray-100 flex justify-between p-4">
        <div>
          &copy; Bush Divers {date}
        </div>
        <div className="space-x-1">
          <Link className="mr-4" href="/privacy">Privacy Policy</Link>
          <Link href="/supporters">Supporters</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
