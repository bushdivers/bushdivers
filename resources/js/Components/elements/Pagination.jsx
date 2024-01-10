import { Card, CardBody, Icon } from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

const Pagination = (props) => {
  return (
    <Card>
      <CardBody>
        <div className="flex-1 flex justify-between sm:hidden">
          <a href="#" className="btn btn-secondary">
            Previous
          </a>
          <a href="#" className="btn btn-secondary">
            Next
          </a>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-start">
          <div>
            <p className="text-sm">
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
              <div
                className="relative z-0 inline-flex rounded-md shadow-sm space-x-2"
                aria-label="Pagination"
              >
                <Link
                  href={props.pages.prev_page_url}
                  className="btn btn-secondary"
                >
                  <span className="sr-only">Previous</span>
                  <Icon as={ChevronLeft} />
                </Link>
                <Link
                  href={props.pages.next_page_url}
                  className="btn btn-secondary"
                >
                  <span className="sr-only">Next</span>
                  <Icon as={ChevronRight} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default Pagination
