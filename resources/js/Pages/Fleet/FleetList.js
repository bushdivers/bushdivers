import React from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Card from '../../Shared/Elements/Card'
import FleetCardContent from '../../Shared/Components/Fleet/FleetCardContent'

const FleetList = ({ fleet }) => {
  const fleetItems = fleet.map((f) => <Card key={f.id} content={<FleetCardContent fleet={f} />} />)

  return (
    <div>
      <PageTitle title="Fleet" />
      {fleetItems}
    </div>
  )
}

FleetList.layout = page => <Layout children={page} title="Fleet" />

export default FleetList
