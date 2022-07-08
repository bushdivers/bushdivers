import React, { useEffect, useState } from 'react'
import AppLayout from '../../Shared/AppLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import NewResource from '../../Shared/Components/Resources/NewResource'
import ExistingResources from '../../Shared/Components/Resources/ExistingResources'

const Resources = ({ categories, resources }) => {
  const [selectedResource, setSelectedResource] = useState(null)
  const [clearForm, setClearForm] = useState(false)

  useEffect(() => {
    setClearForm(true)
  }, [])

  function handleSelectedResource (r) {
    setSelectedResource(r)
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded shadow p-4 text-orange-500">
      <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />  Please use this form to submit a new resource, or select one of your existing packages to update
      </div>
      <div className="flex justify-between items-start mt-4">
        <div className="w-2/3 bg-white rounded shadow p-4 mr-2">
          <NewResource categories={categories} selectedResource={selectedResource} shouldClearForm={clearForm} />
        </div>
        <div className="w-1/3 bg-white rounded shadow p-4 ml-2">
          <ExistingResources resources={resources} selectResource={handleSelectedResource} />
        </div>
      </div>
    </div>
  )
}

Resources.layout = page => <AppLayout children={page} title="Submit a Resource" heading="Submit a Resource" />

export default Resources
