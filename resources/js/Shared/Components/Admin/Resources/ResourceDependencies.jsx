import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

const ResourceDependencies = ({ dependencies, updateDependencies }) => {
  // const [dependencies, setDependencies] = useState([])
  const [currentDependency, setCurrentDependency] = useState({
    title: '',
    package: '',
    mandatory: true,
    url: ''
  })
  const [showForm, setShowForm] = useState(false)
  const [errors, setErrors] = useState({
    title: '',
    package: ''
  })

  function addDependency () {
    console.log('add')
    let titleError = ''
    let packageError = ''
    let hasErrors = false
    if (currentDependency.title === '') {
      titleError = 'Please add a title'
      hasErrors = true
    }
    if (currentDependency.package === '' || currentDependency.package === null) {
      packageError = 'Please specify the package name'
      hasErrors = true
    }
    if (hasErrors) {
      setErrors({
        title: titleError,
        package: packageError
      })
      return
    }
    console.log('updating')
    updateDependencies(currentDependency, 'add')
    setCurrentDependency({
      title: '',
      package: '',
      url: '',
      mandatory: true
    })
    setShowForm(false)
    setErrors({
      title: '',
      package: ''
    })
  }

  function cancel () {
    console.log('cancel')
    setShowForm(false)
    setErrors({
      title: '',
      package: ''
    })
  }

  function handleDependencyChange (e) {
    const key = e.target.id
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setCurrentDependency(values => ({
      ...values,
      [key]: value
    }))
  }

  function removeDependency (dependency) {
    updateDependencies(dependency, 'remove')
  }

  return (
    <div className="my-2">
      <div className="flex justify-between">
        <h3 className="text-lg">Dependencies</h3>
        <button onClick={() => setShowForm(true)} className="btn btn-light"><FontAwesomeIcon icon={faPlus} /></button>
      </div>
      <div>
        {dependencies && dependencies.map((dependency) => (
          <div key={dependency.package} className="bg-orange-50 rounded shadow p-2 my-2">
            <div className="flex justify-between items-center">
              <div>
                {dependency.title}
                <span className="italic ml-2 text-sm">{dependency.mandatory ? 'Mandatory' : 'Optional'}</span>
              </div>
              <div>
                <FontAwesomeIcon onClick={() => removeDependency(dependency)} className="p-2 cursor-pointer" icon={faTimesCircle} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <>
          <div className="my-2">
            <label htmlFor="title" className="block"><span className="text-gray-700">Dependency Title</span></label>
            <input id="title" value={currentDependency.title} onChange={handleDependencyChange} type="text" className="form-input form" />
            {errors.title && <div className="text-sm text-red-500">{errors.title}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="package" className="block"><span className="text-gray-700">Dependency Package Name</span></label>
            <input id="package" value={currentDependency.package} onChange={handleDependencyChange} type="text" className="form-input form" />
            {errors.package && <div className="text-sm text-red-500">{errors.package}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="url" className="block"><span className="text-gray-700">Dependency URL (if external)</span></label>
            <input id="url" value={currentDependency.url} onChange={handleDependencyChange} type="text" className="form-input form" />
          </div>
          <div className="my-2">
            <label htmlFor="mandatory" className="w-1/2 inline-flex items-center">
              <input id="mandatory" checked={currentDependency.mandatory} onChange={handleDependencyChange} type="checkbox" className="form-checkbox rounded border-gray-300 text-orange-500 shadow-sm focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50" />
              <span className="text-gray-700 ml-2">Mandatory?</span>
            </label>
          </div>
          <div className="mt-4">
            <button onClick={() => addDependency()} className="btn btn-secondary">Add Dependency</button>
            <button onClick={() => cancel()} className="ml-2 btn btn-light">Cancel</button>
          </div>
        </>
      )}
    </div>
  )
}

export default ResourceDependencies
