import { Button } from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import axios from 'axios'
import React from 'react'

const FleetAircraft = (props) => {
  const handleSale = async (ac) => {
    const res = await axios.get(`/api/aircraft/price/${ac.id}`)
    if (res.status === 200) {
      if (
        window.confirm(
          `Are you sure you want to sell this aircraft ${ac.registration} for $${res.data.price}?`
        )
      ) {
        router.post(`/marketplace/sell/${ac.id}/admin`)
      }
    }
  }
  return (
    <>
      {props.fleet.aircraft.map((detail) => (
        <tr key={detail.id} className="bg-gray-50">
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
