import React from 'react'
import AppLayout from '../../Shared/AppLayout'
import Card from '../../Shared/Elements/Card'
import FleetCardContent from '../../Shared/Components/Fleet/FleetCardContent'

const FleetDetails = ({ fleet }) => {
  return (
    <div className="p-4">
      {fleet && fleet.map((f) => (
        <div key={f.id} className="my-4">
        <Card>
          <FleetCardContent fleet={f} />
        </Card>
        </div>
      ))}
    </div>
  )
}

FleetDetails.layout = page => <AppLayout children={page} title="Fleet" heading="Fleet" />

export default FleetDetails
