import { Button } from '@chakra-ui/react'
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
        <tr key={`${props.fleet.id}-${detail.id}`} className="bg-gray-50">
          <td>{detail.registration}</td>
          <td>Current Location: {detail.location.identifier}</td>
          <td>
            <div className="flex items-center">
              <Button
                onClick={() => handleSale(detail)}
                variant="ghost"
                size="xs"
              >
                Sell
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}

export default FleetAircraft
