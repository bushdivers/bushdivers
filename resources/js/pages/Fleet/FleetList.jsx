import { Card, CardBody } from '@chakra-ui/react'
import React from 'react'

import FleetCardContent from '../../components/fleet/FleetCardContent'
import Layout from '../../components/layout/Layout'

const FleetList = ({ fleet }) => {
  const fleetItems = fleet.map((f) => (
    <Card
      key={f.id}
      content={
        <CardBody>
          <FleetCardContent fleet={f} />
        </CardBody>
      }
    />
  ))

  return <div>{fleetItems}</div>
}

FleetList.layout = (page) => <Layout children={page} title="Fleet" />

export default FleetList
