import React, { useEffect, useState } from 'react'
import ResourceDependencies from '../Admin/Resources/ResourceDependencies'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faUpload } from '@fortawesome/free-solid-svg-icons'
import Uploader from '../../Elements/Uploader'
import ProgressBar from '../../Elements/ProgressBar'
import Label from '../../Elements/Forms/Label'
import { useForm } from '@inertiajs/inertia-react'
import { ZipReader, TextWriter, BlobReader } from '@zip.js/zip.js'

const NewResource = ({ categories, selectedResource, shouldClearForm }) => {
  const { data, setData, post, progress, reset, processing } = useForm({
    categoryId: 1,
    title: '',
    desc: '',
    version: '',
    author: '',
    package: '',
    file: null,
    dependencies: null,
    id: null
  })
  const [errors, setErrors] = useState([])
  const [dependencies, setDependencies] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [packageName, setPackageName] = useState('')
  const [packageVersion, setPackageVersion] = useState('')

  useEffect(async () => {
    await setData({
      categoryId: selectedResource !== null ? selectedResource.category_id : 1,
      title: selectedResource !== null ? selectedResource.title : '',
      desc: selectedResource !== null ? selectedResource.description : '',
      version: selectedResource !== null ? selectedResource.version : '',
      author: selectedResource !== null ? selectedResource.author : '',
      package: selectedResource !== null ? selectedResource.filename : '',
      file: null,
      dependencies: selectedResource !== null && selectedResource.dependencies !== null ? selectedResource.dependencies : null,
      id: selectedResource !== null ? selectedResource.id : null
    })
    setSelectedFile(null)
    setDependencies(selectedResource !== null && selectedResource.dependencies !== null ? selectedResource.dependencies : [])
  }, [selectedResource])

  useEffect(() => {
    setData('dependencies', dependencies)
  }, [dependencies])

  useEffect(() => {
    if (packageVersion.length) setData('version', packageVersion)
  }, [packageVersion])

  useEffect(() => {
    if (packageName.length) setData('package', packageName)
  }, [packageName])

  function updateDependencies (dep, action) {
    switch (action) {
      case 'add':
        // eslint-disable-next-line no-case-declarations
        const newDependencies = dependencies.concat(dep)
        setDependencies(newDependencies)
        break
      case 'remove':
        // eslint-disable-next-line no-case-declarations
        const newDep = dependencies.filter(d => d.filename !== dep.filename)
        setDependencies(newDep)
        break
    }
  }

  async function handleFile ({ target: { files } }) {
    setSelectedFile(files[0])
    setData('file', files[0])
    const reader = new ZipReader(new BlobReader(files[0]))
    const entries = await reader.getEntries()
    if (entries.length) {
      // get initial directory name
      const pName = await processPackageName(entries[0].filename)
      console.log(pName)
      const version = await processPackageVersion(entries)
      console.log(version)

      // if (pName !== '') {
      //   setSelectedFile(files[0])
      //   setData('file', files[0])
      // }
    }
    await reader.close()
  }

  async function processPackageVersion (entries) {
    // loop through files to find the manifest.json file
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].filename.includes('manifest.json')) {
        const text = await entries[i].getData(
          new TextWriter()
        )
        const manifest = JSON.parse(text)
        await setPackageVersion(manifest.package_version)
        return manifest.package_version
      }
    }
  }

  async function processPackageName (fileName) {
    const derivedPackageName = fileName.substring(0, fileName.indexOf('/'))
    console.log(data.package)
    console.log(derivedPackageName)
    // if (data.package && derivedPackageName !== data.package) {
    //   setErrors({ ...errors, package: 'Package Name in new zip file does not match existing package - please update the zip to match the existing package name' })
    //   return ''
    // }
    await setPackageName(derivedPackageName)
    return derivedPackageName
  }

  async function validateForm () {
    const tempErrors = {}
    let formIsValid = true
    // title
    if (!data.title) {
      formIsValid = false
      tempErrors.title = 'Title is required'
    }
    // // package
    if (!data.package) {
      formIsValid = false
      tempErrors.package = 'Package name is required'
    }
    // desc
    if (!data.desc) {
      formIsValid = false
      tempErrors.desc = 'Description is required'
    }
    // // version
    if (!data.version) {
      formIsValid = false
      tempErrors.version = 'Version is required'
    }
    // author
    if (!data.author) {
      formIsValid = false
      tempErrors.author = 'Author display name is required'
    }
    setErrors(tempErrors)
    return formIsValid
  }

  async function handleSubmit (e) {
    e.preventDefault()
    const status = await validateForm()
    if (status) {
      post('/resources', {
        onSuccess: () => {
          clearForm()
        }
      })
    }
  }

  const clearForm = () => {
    reset()
    setDependencies([])
    setSelectedFile(null)
  }

  return (
    <div>
      <h2 className="text-xl">Submit New Resource</h2>
      <form onSubmit={handleSubmit}>
        <div className="my-2">
          <Label relatedInput="categoryId" isRequired={true} helpText="Select the type of addon this is" labelText="Category" />
          <select id="categoryId" value={data.categoryId} onChange={e => setData('categoryId', e.target.value)} className="form-select form">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.category}</option>
            ))}
          </select>
          {errors.categoryId && <div className="text-sm text-red-500">{errors.categoryId}</div>}
        </div>
        <div className="my-2">
          <Label relatedInput="title" isRequired={true} helpText="This should be the display name of the addon" labelText="Title" />
          <input id="title" value={data.title} onChange={e => setData('title', e.target.value)} type="text" className="form-input form" />
          {errors.title && <div className="text-sm text-red-500">{errors.title}</div>}
        </div>
        <div className="my-2">
          <Label relatedInput="desc" isRequired={true} helpText="This should be a description of the addon" labelText="Description" />
          <textarea id="desc" value={data.desc} onChange={e => setData('desc', e.target.value)} className="form-input form" />
          {errors.desc && <div className="text-sm text-red-500">{errors.desc}</div>}
        </div>
        <div className="my-2">
          <Label relatedInput="package" isRequired={false} helpText="This will be retrieved from the folder name in the zip file" labelText="Package Name" />
          <input id="package" value={data.package} type="text" disabled={true} className="form-input form bg-gray-100" />
          {errors.package && <div className="text-sm text-red-500">{errors.package}</div>}
        </div>
        <div className="my-2">
          <Label relatedInput="version" isRequired={false} helpText="This will be retrieved from the manifest.json file in the zip file" labelText="Package Version" />
          <input id="version" value={data.version} disabled={true} type="text" className="form-input form bg-gray-100" />
          {errors.version && <div className="text-sm text-red-500">{errors.version}</div>}
        </div>
        <div className="mt-2 mb-4">
          <Label relatedInput="author" isRequired={true} helpText="This is how the name of the author of the package should be displayed" labelText="Author Display Name" />
          <input id="author" value={data.author} onChange={e => setData('author', e.target.value)} type="text" className="form-input form" />
          {errors.author && <div className="text-sm text-red-500">{errors.author}</div>}
        </div>
        <hr />
        <div className="my-2">
          <h3 className="text-lg">Upload file</h3>
          {selectedFile === null && (
            <div className="my-2">
              <Uploader onChange={handleFile} accept=".zip">
                <div className="cursor-pointer bg-orange-50 py-8 text-orange-500 border-orange-500 border border-dashed px-2 rounded-lg w-full flex items-center justify-center">
                  <div className="flex flex-col">
                    <FontAwesomeIcon className="text-2xl" icon={faUpload} />
                    <span className="mt-2">Add a file</span>
                  </div>
                </div>
              </Uploader>
            </div>
          )}
          {selectedFile && (
            <>
              <div className="flex justify-between items-center">
                <div><span className="text-gray-700 text-sm">{selectedFile.name}</span> <span className="text-gray-700 text-sm">{((selectedFile.size / 1024) / 1024).toFixed(2)}mb</span></div>
                <FontAwesomeIcon onClick={() => setSelectedFile(null)} className="p-2 cursor-pointer" icon={faTimesCircle} />
              </div>
              {progress && (
                <ProgressBar progress={progress.percentage} />
              )}
            </>
          )}
        </div>
        <hr />
        <ResourceDependencies dependencies={dependencies} updateDependencies={updateDependencies} />
        <div className="flex justify-end mt-4">
          <button type="submit" className="btn btn-secondary" disabled={processing}>Submit Resource</button>
        </div>
      </form>
    </div>
  )
}

export default NewResource
