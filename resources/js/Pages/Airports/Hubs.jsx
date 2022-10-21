import React from 'react'
import HubMap from '../../Shared/Components/Hubs/HubMap'
import { usePage } from '@inertiajs/inertia-react'
import AppLayout from '../../Shared/AppLayout'
import Card from '../../Shared/Elements/Card'

const Hubs = ({ hubs }) => {
  const { auth } = usePage().props
  return (
    <>
      <Card compact="true">
        <HubMap hubs={hubs} size="xl" mapStyle={auth.user.map_style} />
      </Card>
    </>
  )
}

Hubs.layout = page => <AppLayout children={page} heading="Hubs" title="Hubs" />

export default Hubs
