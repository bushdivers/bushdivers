import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import Card from './Card'

const PaginationTable = props => {
  return (
    <Card>
      <div className="flex items-center">
        <div>
          <p className="text-sm">
            Page
            <span className="font-medium mx-1">{props.table.getState().pagination.pageIndex + 1} of</span>
            <span className="font-medium mx-1">{props.table.getPageCount()}</span>
          </p>
        </div>
        <div className="pl-4">
          {props.table.getPageCount() > 1 && (
            <div className="relative z-0 inline-flex rounded-md shadow-sm space-x-2" aria-label="Pagination">
              <button onClick={() => props.table.previousPage()}
                      disabled={!props.table.getCanPreviousPage()}
                 className="btn btn-secondary btn-sm">
                <span className="sr-only">Previous</span>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button onClick={() => props.table.nextPage()}
                      disabled={!props.table.getCanNextPage()}
                 className="btn btn-secondary btn-sm">
                <span className="sr-only">Next</span>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default PaginationTable
