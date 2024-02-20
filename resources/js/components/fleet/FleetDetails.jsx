import { Box, Button, Card, CardBody } from '@chakra-ui/react'
import { Link, usePage } from '@inertiajs/react'
import React from 'react'

import FleetCardContent from './FleetCardContent.jsx'

const FleetDetails = ({ fleet }) => {
  const { auth } = usePage().props

  const isFleetAdmin = () => {
    return auth.user.user_roles.includes('fleet_admin')
  }

  return (
    <Box>
      {isFleetAdmin() && (
        <Link href="/admin/fleet" className="btn btn-secondary btn-xs">
          <Button size="sm">Fleet Administration</Button>
        </Link>
      )}
      {fleet &&
        fleet.map((f) => (
          <Box my={4} key={f.id}>
            <Card>
              <CardBody>
                <FleetCardContent fleet={f} />
              </CardBody>
            </Card>
          </Box>
        ))}
    </Box>
  )
}

export default FleetDetails
