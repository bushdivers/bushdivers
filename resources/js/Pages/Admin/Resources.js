import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppLayout from '../../Shared/AppLayout'
import NewCategory from '../../Shared/Components/Admin/Resources/NewCategory'
import NewResource from '../../Shared/Components/Admin/Resources/NewResource'
import { Inertia } from '@inertiajs/inertia'
import { faClose } from '@fortawesome/free-solid-svg-icons'

const Resources = ({ resources }) => {
  const [showNewCat, setShowNewCat] = useState(false)
  const [showNewRes, setShowNewRes] = useState(false)
  const [formMethod, setFormMethod] = useState('new')
  const [selectedResource, setSelectedResource] = useState({})

  const removeResource = (id) => {
    Inertia.delete(`/admin/resources/${id}`)
  }

  const handleEdit = (resource) => {
    setFormMethod('edit')
    setSelectedResource(resource)
    setShowNewRes(true)
  }

  return (
    <div className="p-4">
      <div>
        <button onClick={() => setShowNewCat(true)} className="btn btn-secondary mr-2">Add Category</button>
        <button onClick={() => setShowNewRes(true)} className="btn btn-secondary">Add Resource</button>
      </div>
      <NewCategory showNewCat={showNewCat} updateShowCat={setShowNewCat} />
      <NewResource showNewRes={showNewRes} updateShowRes={setShowNewRes} method={formMethod} data={selectedResource} />
      {resources && resources.map((category) => (
        <div key={category.id}>
          <h2 className="text-2xl my-2">{category.category}</h2>
          {category.resources.map((resource) => (
            <div key={resource.id} className="bg-white rounded shadow p-2 flex my-1 items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>{resource.title}</div>
                <div className="text-orange-500">{resource.url}</div>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => handleEdit(resource)} className="btn btn-secondary">Edit</button>
                <FontAwesomeIcon icon={faClose} onClick={() => removeResource(resource.id)} className="cursor-pointer hover:bg-gray-100 p-2 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

Resources.layout = page => <AppLayout children={page} title="Manage Resources" heading="Manage Resources" />

export default Resources
