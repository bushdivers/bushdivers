import React, { useState } from 'react'
import { usePage } from '@inertiajs/inertia-react'
import ResourceDependencies from '../Admin/Resources/ResourceDependencies'
// import { Inertia } from '@inertiajs/inertia'

const NewResource = ({ categories }) => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    categoryId: 1,
    title: '',
    desc: '',
    version: '',
    author: '',
    url: ''
  })
  const [dependencies, setDependencies] = useState([])

  function updateDependencies (dep, action) {
    console.log(dep)
    switch (action) {
      case 'add':
        // eslint-disable-next-line no-case-declarations
        const newDependencies = dependencies.concat(dep)
        setDependencies(newDependencies)
        break
      case 'remove':
        // eslint-disable-next-line no-case-declarations
        const newDep = dependencies.filter(d => d.package !== dep.package)
        setDependencies(newDep)
        break
    }
  }

  function handleChange (e) {
    const key = e.target.id
    const value = e.target.value
    setValues(values => ({
      ...values,
      [key]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // clearForm()
  }

  const clearForm = () => {
    setValues({
      categoryId: 1,
      title: '',
      desc: '',
      version: '',
      author: '',
      url: '',
      dependencies: null
    })
    setDependencies([])
  }

  return (
    <div>
      <h2 className="text-xl">Submit New Resource</h2>
      <form onSubmit={handleSubmit}>
        <div className="my-2">
          <label htmlFor="categoryId" className="block"><span className="text-gray-700">Category</span></label>
          <select id="categoryId" value={values.categoryId} onChange={handleChange} className="form-select form">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.category}</option>
            ))}
          </select>
          {errors.categoryId && <div className="text-sm text-red-500">{errors.categoryId}</div>}
        </div>
        <div className="my-2">
          <label htmlFor="title" className="block"><span className="text-gray-700">Package Title</span></label>
          <input id="title" value={values.title} onChange={handleChange} type="text" className="form-input form" />
          {errors.title && <div className="text-sm text-red-500">{errors.title}</div>}
        </div>
        <div className="my-2">
          <label htmlFor="desc" className="block"><span className="text-gray-700">Package Description</span></label>
          <textarea id="desc" value={values.desc} onChange={handleChange} className="form-input form" />
          {errors.desc && <div className="text-sm text-red-500">{errors.desc}</div>}
        </div>
        <div className="my-2">
          <label htmlFor="version" className="block"><span className="text-gray-700">Package Version</span></label>
          <input id="version" value={values.version} onChange={handleChange} type="text" className="form-input form" />
          {errors.version && <div className="text-sm text-red-500">{errors.version}</div>}
        </div>
        <div className="mt-2 mb-4">
          <label htmlFor="author" className="block"><span className="text-gray-700">Author Display Name</span></label>
          <input id="author" value={values.author} onChange={handleChange} type="text" className="form-input form" />
          {errors.author && <div className="text-sm text-red-500">{errors.author}</div>}
        </div>
        <hr />
        <div className="my-2">
          <h3 className="text-lg">Upload file</h3>
        </div>
        <hr />
        <ResourceDependencies dependencies={dependencies} updateDependencies={updateDependencies} />
        <div className="flex justify-end mt-4">
          <button className="btn btn-secondary">Submit Resource</button>
        </div>
      </form>
    </div>
  )
}

export default NewResource
