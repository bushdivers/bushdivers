import { Button, Td, Tr } from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import axios from 'axios'
import React from 'react'

import { useMessageBox } from '../elements/MessageBoxProvider.jsx'

const FleetAircraft = (props) => {
  const messageBox = useMessageBox()

  const handleSale = async (ac) => {
    const res = await axios.get(`/api/aircraft/price/${ac.id}`)
    if (res.status === 200) {
      const accepted = await messageBox.confirm({
        title: 'Confirm Aircraft Sale',
        description: `Are you sure you want to sell this aircraft ${ac.registration} for $${res.data.price}?`,
        status: 'warning',
        confirmText: 'Sell Aircraft',
        confirmColorScheme: 'red',
      })

      if (accepted) {
        router.post(`/marketplace/sell/${ac.id}/admin`)
      }
    }
  }
  return (
    <>
      {props.fleet.aircraft.map((detail) => (
        <Tr key={`${props.fleet.id}-${detail.id}`} className="bg-gray-50">
          <Td />
          <Td>{detail.registration}</Td>
          <Td colSpan="2">Current Location: {detail.location.identifier}</Td>
          <Td>
            <Button
              onClick={() => handleSale(detail)}
              variant="ghost"
              size="xs"
            >
              Sell
            </Button>
          </Td>
        </Tr>
      ))}
    </>
  )
}

export default FleetAircraft
