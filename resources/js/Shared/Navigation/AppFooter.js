import React from 'react'

const AppFooter = () => {
  return (
    <footer className="fixed bottom-0 left-0 md:left-64 right-0 footer px-2 py-4 bg-gray-100 z-20 shadow">
      <div className="footer-content">
        <p className="text-sm text-gray-600 text-center">© Bush Divers {new Date().getFullYear()}. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default AppFooter

