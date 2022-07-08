import React from 'react'
import dayjs from '../../../Helpers/date.helpers'

const ExistingResources = ({ resources, selectResource }) => {
  return (
    <div>
      <h2 className="text-xl">Choose Existing Resource</h2>
      <div className="mt-2">
        {resources && resources.map((resource) => (
          <div key={resource.id} onClick={() => selectResource(resource)} className="mt-2 bg-white shadow-lg border border-gray-100 rounded p-2 cursor-pointer hover:bg-orange-50">
            <div className="flex justify-between">
              <a className="link" href={resource.url}>{resource.title}</a>
              <span>Dependences: {resource.dependencies && resource.dependencies.length > 0 ? resource.dependencies.length : 0}</span>
            </div>
            <div className="flex justify-between text-sm italic mt-2">
              <div className="space-x-2">
                <span>{resource.version}</span>
                <span>{resource.filename}</span>
              </div>
              <span>{dayjs(resource.created_at).format('ddd DD MMM YYYY')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExistingResources
