import React from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'

const Hubs = ({ hubs }) => {
  return (
    <>
      <PageTitle title="Hubs" />
      <div className="mt-4">
        {hubs && hubs.map((hub) => (
          <div key={hub.id} className="rounded shadow bg-white p-4 my-2" style={{ backgroundImage: `url(img/hubs/${hub.identifier}.png)` }}>
            <div className="flex flex-col md:flex-row items-start justify-between">
              <div className="flex flex-col md:flex-row">
                <div>Change to use background image</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

Hubs.layout = page => <Layout children={page} title="Hubs" />

export default Hubs
