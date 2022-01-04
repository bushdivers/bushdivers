import React from 'react'
import AppLayout from '../../Shared/AppLayout'

const Resources = ({ categories }) => {
  return (
    <div className="p-4">
      <p>This is a work in progress</p>
      {categories && categories.map((category) => (
        <>
          <h1 className="text-2xl my-1" key={category.id}>{category.category}</h1>
          {category.resources.map((resource) => (
            <>
              <div key={resource.id} className="my-1 bg-white rounded shadow p-2">
                <div>
                  <a className="link" href={resource.url} target="_blank" rel="noreferrer">{resource.title}</a>
                </div>
              </div>
            </>
          ))}
        </>
      ))}
    </div>
  )
}

Resources.layout = page => <AppLayout children={page} title="Resources" heading="Resources" />

export default Resources
