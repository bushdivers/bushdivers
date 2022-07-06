import React, { useState } from 'react'
import { usePage } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'

const NewCategory = ({ showNewCat, updateShowCat }) => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    category: ''
  })

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
    Inertia.post('/admin/categories', values)
    updateShowCat(false)
  }

  return (
    <div className={`${showNewCat ? 'block' : 'hidden'} my-2 p-2 bg-white rounded shadow`}>
      <div className="w-1/2">
        <div className="flex">
          <h2 className="text-lg">Add New Category</h2><span><button onClick={() => updateShowCat(false)} className="btn btn-light ml-2">Hide</button></span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="my-2">
            <label htmlFor="category" className="block"><span className="text-gray-700">Category</span></label>
            <input id="category" value={values.category} onChange={handleChange} type="text" className="form-input form" />
            {errors.category && <div className="text-sm text-red-500">{errors.category}</div>}
          </div>
          <button className="btn btn-secondary">Add</button>
        </form>
      </div>
    </div>
  )
}

export default NewCategory
