import React, { useEffect, useState } from 'react'
import { usePage } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import axios from 'axios'

const NewResource = ({ showNewRes, updateShowRes, method, data }) => {
  const { errors } = usePage().props
  const [categories, setCategories] = useState([])
  const [values, setValues] = useState({
    categoryId: 1,
    title: '',
    url: ''
  })

  // on load get categories
  useEffect(async () => {
    const catsResp = await axios.get('/api/resources/categories')
    if (catsResp.status === 200) {
      setCategories(catsResp.data.categories)
    }
  }, [])

  useEffect(() => {
    setValues({
      categoryId: data.category_id,
      title: data.title,
      url: data.url
    })
  }, [data])

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
    if (method === 'new') {
      Inertia.post('/admin/resources', values)
    } else {
      Inertia.patch(`/admin/resources/${data.id}`, values)
    }
    clearForm()
  }

  const clearForm = () => {
    setValues({
      categoryId: 1,
      title: '',
      url: ''
    })
  }

  const handleHide = () => {
    clearForm()
    updateShowRes(false)
  }

  return (
    <div className={`${showNewRes ? 'block' : 'hidden'} my-2 p-2 bg-white rounded shadow`}>
      <div className="w-1/2">
        <div className="flex">
          <h2 className="text-lg">Add New Resource</h2><span><button onClick={() => handleHide()} className="btn btn-light ml-2">Hide</button></span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="my-2">
            <label htmlFor="title" className="block"><span className="text-gray-700">Title Text</span></label>
            <input id="title" value={values.title} onChange={handleChange} type="text" className="form-input form" />
            {errors.title && <div className="text-sm text-red-500">{errors.title}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="url" className="block"><span className="text-gray-700">URL <span className="text-sm">(inc. http/https)</span></span></label>
            <input id="url" value={values.url} onChange={handleChange} type="text" className="form-input form" />
            {errors.url && <div className="text-sm text-red-500">{errors.url}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="categoryId" className="block"><span className="text-gray-700">Category</span></label>
            <select id="categoryId" value={values.categoryId} onChange={handleChange} className="form-select form">
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.category}</option>
              ))}
            </select>
            {errors.categoryId && <div className="text-sm text-red-500">{errors.categoryId}</div>}
          </div>
          <button className="btn btn-secondary">{method === 'new' ? 'Add' : 'Update'}</button>
        </form>
      </div>
    </div>
  )
}

export default NewResource
