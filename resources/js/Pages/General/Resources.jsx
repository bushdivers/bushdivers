import React from 'react'
import AppLayout from '../../Shared/AppLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import NewResource from '../../Shared/Components/Resources/NewResource'

const Resources = ({ categories }) => {
  return (
    <div className="p-4">
      <div className="bg-white rounded shadow p-4 text-orange-500">
      <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />  Please use this form to submit a new resource, or select one of your existing packages to update
      </div>
      <div className="flex justify-between mt-4">
        <div className="w-1/2 bg-white rounded shadow p-4 mr-2">
          <NewResource categories={categories} />
        </div>
        <div className="w-1/2 bg-white rounded shadow p-4 ml-2">
          <h2 className="text-xl">Choose Existing Resource</h2>
        </div>
      </div>
    </div>
  )
}

Resources.layout = page => <AppLayout children={page} title="Submit a Resource" heading="Submit a Resource" />

export default Resources
