import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppLayout from '../../Shared/AppLayout'
import NewCategory from '../../Shared/Components/Admin/Resources/NewCategory'
import { Inertia } from '@inertiajs/inertia'
import { faClose, faPencil, faTimes } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import ResourceApprovals from '../../Shared/Components/Admin/Resources/ResourceApprovals'

const Resources = ({ resources, categories }) => {
  const [showNewCat, setShowNewCat] = useState(false)
  const [selectedCat, setSelectedCat] = useState(null)
  const [updatedCat, setUpdatedCat] = useState('')

  function editCat (cat) {
    setSelectedCat(cat.id)
    setUpdatedCat(cat.category)
  }

  function handleCatChange (e) {
    setUpdatedCat(e.target.value)
  }

  async function handleKeyDown (e, cat) {
    if (e.key === 'Enter') {
      const res = await axios.put('/api/admin/categories', { id: cat, category: updatedCat })
      if (res.status === 200) {
        Inertia.reload({ only: ['categories'] })
        setSelectedCat(null)
      }
    }
  }

  return (
    <div className="p-4">
      <div>
        <button onClick={() => setShowNewCat(true)} className="btn btn-secondary mr-2">Add Category</button>
      </div>
      <NewCategory showNewCat={showNewCat} updateShowCat={setShowNewCat} />
      <div className="flex justify-between mt-4">
        <div className="w-2/3 bg-white p-4 mr-2 shadow rounded">
          <ResourceApprovals resources={resources} />
        </div>
        <div className="w-1/3 bg-white p-4 ml-2 shadow rounded">
          <h2>Categories</h2>
          <table className="table-condensed table-auto">
            <thead>
              <tr>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {categories && categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    {selectedCat === cat.id
                      ? (
                        <input onKeyDown={(e) => handleKeyDown(e, cat.id)} className="form form-input" value={updatedCat} onChange={handleCatChange} />
                        )
                      : (
                        <>{cat.category}</>
                        )
                    }
                  </td>
                  <td>
                    <button onClick={() => editCat(cat)} className="btn btn-light"><FontAwesomeIcon icon={faPencil} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

Resources.layout = page => <AppLayout children={page} title="Manage Resources" heading="Manage Resources" />

export default Resources
