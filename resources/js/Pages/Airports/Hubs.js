import React from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'
import HubMap from '../../Shared/Components/Hubs/HubMap'

const Hubs = ({ hubs }) => {
  return (
    <>
      <PageTitle title="Hubs" />
      <div className="mt-4 rounded shadow bg-white p-4">
        <HubMap hubs={hubs} size="xl" />
      </div>
    </>
  )
}

Hubs.layout = page => <Layout children={page} title="Hubs" />

export default Hubs
