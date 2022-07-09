import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import Label from '../../../Elements/Forms/Label'

const ResourceDependencies = ({ dependencies, updateDependencies }) => {
  // const [dependencies, setDependencies] = useState([])
  const [currentDependency, setCurrentDependency] = useState({
    title: '',
    filename: '',
    mandatory: true,
    url: ''
  })
  const [showForm, setShowForm] = useState(false)
  const [errors, setErrors] = useState({
    title: '',
    filename: ''
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
    if (!/^\S*$/.test(currentDependency.filename)) {
      packageError = 'Please specify the package name without spaces i.e package-name'
      hasErrors = true
    }
    if (hasErrors) {
      setErrors({
        title: titleError,
        filename: packageError
      })
      return
    }
    console.log('updating')
    updateDependencies(currentDependency, 'add')
    setCurrentDependency({
      title: '',
      filename: '',
      url: '',
      mandatory: true
    })
    setShowForm(false)
    setErrors({
      title: '',
      filename: ''
    })
  }

  function cancel () {
    console.log('cancel')
    setShowForm(false)
    setErrors({
      title: '',
      filename: ''
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
        <button type="button" onClick={() => setShowForm(true)} className="btn btn-light"><FontAwesomeIcon icon={faPlus} /></button>
      </div>
      <div>
        {dependencies && dependencies.map((dependency) => (
          <div key={dependency.filename} className="bg-orange-50 rounded shadow p-2 my-2">
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
            <Label relatedInput="title" isRequired={true} helpText="This is the display name of the dependency" labelText="Dependency Title" />
            <input id="title" value={currentDependency.title} onChange={handleDependencyChange} type="text" className="form-input form" />
            {errors.title && <div className="text-sm text-red-500">{errors.title}</div>}
          </div>
          <div className="my-2">
            <Label relatedInput="filename" isRequired={true} helpText="This is the MSFS package name for the dependency i.e daves-crooked-library" labelText="Package Name" />
            <input id="filename" value={currentDependency.filename} onChange={handleDependencyChange} type="text" className="form-input form" />
            {errors.filename && <div className="text-sm text-red-500">{errors.filename}</div>}
          </div>
          <div className="my-2">
            <Label relatedInput="url" isRequired={false} helpText="This should be the url to the dependency, if it is not a Bush Divers package" labelText="Dependency URL (if external)" />
            <input id="url" value={currentDependency.url} onChange={handleDependencyChange} type="text" className="form-input form" />
          </div>
          <div className="my-2">
            <label htmlFor="mandatory" className="w-1/2 inline-flex items-center">
              <input id="mandatory" checked={currentDependency.mandatory} onChange={handleDependencyChange} type="checkbox" className="form-checkbox rounded border-gray-300 text-orange-500 shadow-sm focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50" />
              <span className="text-gray-700 ml-2">Mandatory?</span>
            </label>
          </div>
          <div className="mt-4">
            <button type="button" onClick={() => addDependency()} className="btn btn-secondary">Add Dependency</button>
            <button type="button" onClick={() => cancel()} className="ml-2 btn btn-light">Cancel</button>
          </div>
        </>
      )}
    </div>
  )
}

export default ResourceDependencies
