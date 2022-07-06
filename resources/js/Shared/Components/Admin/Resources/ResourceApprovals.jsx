import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons'
import { Inertia } from '@inertiajs/inertia'

const ResourceApprovals = ({ resources }) => {
  const [showDep, setShowDep] = useState(false)
  const [selectedDep, setSelectedDep] = useState(null)

  function toggleDep (r) {
    if (selectedDep !== null && r.id === selectedDep.id) {
      setSelectedDep(null)
      setShowDep(false)
    } else {
      setSelectedDep(r)
      setShowDep(true)
    }
  }

  function rejectResource (id) {
    Inertia.post(`/admin/resources/reject/${id}`, null, { only: ['resources'] })
  }

  function approveResource (id) {
    Inertia.post(`/admin/resources/approve/${id}`, null, { only: ['resources'] })
  }

  return (
    <div>
      <h2>Resource Approvals</h2>
      <div>
        <table className="table-condensed table-auto">
          <thead>
          <tr>
            <th>Category</th>
            <th>Title</th>
            <th>Package</th>
            <th>Version</th>
            <th>Uploaded By</th>
            <th>Author</th>
            <th>Dependencies</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {resources && resources.map((r) => (
            <tr key={r.id}>
              <td>{r.category.category}</td>
              <td><a className="link" href={r.url}>{r.title}</a></td>
              <td>{r.filename}</td>
              <td>{r.version}</td>
              <td>{r.user.name}</td>
              <td>{r.author}</td>
              <td>
                {r.dependencies && r.dependencies.length > 0 ? <>{r.dependencies.length}</> : 0}
                {r.dependencies && (
                  <>
                  <button onClick={() => toggleDep(r)} className="btn btn-light ml-2">{selectedDep && selectedDep.id === r.id ? 'Hide' : 'Show'}</button>
                  {showDep && selectedDep && selectedDep.id === r.id
                    ? (
                      <div className="absolute bg-white shadow-2xl border-orange-200 border-2 rounded-lg">
                        <table className="table-condensed table-auto">
                          <thead>
                          <tr>
                            <th>Title</th>
                            <th>Package Name</th>
                            <th>Type</th>
                          </tr>
                          </thead>
                          <tbody>
                          {r.dependencies.map((dep, index) => (
                            <tr key={index}>
                              <td>
                                {dep.url === null
                                  ? (
                                    <>{dep.title}</>
                                    )
                                  : (
                                    <a className="link" href={dep.url}>{dep.title}</a>
                                    )
                                }
                              </td>
                              <td>{dep.filename}</td>
                              <td>{dep.mandatory ? 'Mandatory' : 'Optional'}</td>
                            </tr>
                          ))}
                          </tbody>
                        </table>
                      </div>
                      )
                    : <></>
                  }
                  </>
                )}
              </td>
              <td>
                <button onClick={() => approveResource(r.id)} className="btn btn-secondary mr-4"><FontAwesomeIcon icon={faCheck} /></button>
                <button onClick={() => rejectResource(r.id)} className="btn btn-light ml-4"><FontAwesomeIcon icon={faBan} /></button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResourceApprovals
