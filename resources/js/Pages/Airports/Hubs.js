import React from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'
import { Link } from '@inertiajs/inertia-react'

const Hubs = ({ hubs }) => {
  return (
    <>
      <PageTitle title="Hubs" />
      <div className="mt-4">
        {hubs && hubs.map((hub) => (
          <div key={hub.id} className="rounded shadow bg-white p-4 my-2" style={{ backgroundImage: `url(img/hubs/${hub.identifier}.png)` }}>
            <div className="flex flex-col md:flex-row items-start justify-between">
              <div>
                <div className="bg-gray-800 text-white p-3 rounded" style={{ background: 'rgba(0,0,0,0.51)' }}>
                  <Link href={`/airports/${hub.identifier}`} className="text-xl text-white">{hub.identifier}</Link>
                </div>
                <div className="bg-gray-800 text-white p-3 rounded mt-4" style={{ background: 'rgba(0,0,0,0.51)' }}>
                  {hub.name}
                </div>
              </div>
              <div className="bg-gray-800 text-white p-3 rounded justify-end" style={{ background: 'rgba(0,0,0,0.51)' }}>
                {hub.country}
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
