import React from 'react'
import { Link } from '@inertiajs/inertia-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const Pagination = props => {
  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between rounded sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <a href="#"
           className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Previous
        </a>
        <a href="#"
           className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Next
        </a>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-start">
        <div>
          <p className="text-sm text-gray-700">
            Showing
            <span className="font-medium mx-1">{props.pages.from}</span>
            to
            <span className="font-medium mx-1">{props.pages.to}</span>
            of
            <span className="font-medium mx-1">{props.pages.total}</span>
            results
          </p>
        </div>
        <div className="pl-4">
          {props.pages.total > props.pages.per_page && (
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Link href={props.pages.prev_page_url}
                 className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
                <FontAwesomeIcon icon={faChevronLeft} />
              </Link>
              <Link href={props.pages.next_page_url}
                 className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                <FontAwesomeIcon icon={faChevronRight} />
              </Link>
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}

export default Pagination
