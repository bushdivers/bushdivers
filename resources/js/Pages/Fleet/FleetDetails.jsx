import { Link, usePage } from '@inertiajs/react'
import React from 'react'

import Card from '../../components/elements/Card'
import FleetCardContent from '../../components/fleet/FleetCardContent'
import AppLayout from '../../components/layout/AppLayout'

const FleetDetails = ({ fleet }) => {
  const { auth } = usePage().props

  const isFleetAdmin = () => {
    return auth.user.user_roles.includes('fleet_admin')
  }

  return (
    <div className="p-4">
      {isFleetAdmin() && (
        <Link href="/admin/fleet" className="btn btn-secondary btn-xs">
          Fleet Administration
        </Link>
      )}
      {fleet &&
        fleet.map((f) => (
          <div key={f.id} className="my-4">
            <Card>
              <FleetCardContent fleet={f} />
            </Card>
          </div>
        ))}
    </div>
  )
}

FleetDetails.layout = (page) => (
  <AppLayout children={page} title="Fleet" heading="Fleet" />
)

export default FleetDetails
