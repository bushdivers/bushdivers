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
        <div>
          <a className="mr-4" href="#">Privacy Policy</a>
          <Link href="/supporters">Supporters</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
