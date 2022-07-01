import React from 'react'
import AppLayout from '../../Shared/AppLayout'
import Card from '../../Shared/Elements/Card'
import FleetCardContent from '../../Shared/Components/Fleet/FleetCardContent'
import PageTitle from '../../Shared/Navigation/PageTitle'
import { usePage } from '@inertiajs/inertia-react'

const FleetDetails = ({ fleet }) => {
  const { auth } = usePage().props
  const fleetItems = fleet.map((f) => <Card key={f.id} content={<FleetCardContent fleet={f} />} />)

  return (
    <div className="p-4">
      {!auth.user && <PageTitle title="Fleet" />}
      {fleetItems}
    </div>
  )
}

FleetDetails.layout = page => <AppLayout children={page} title="Fleet" heading="Fleet" />

export default FleetDetails
