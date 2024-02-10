import { Button, Icon } from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import { X } from 'lucide-react'
import React from 'react'

const FleetAircraft = (props) => {
  return (
    <>
      {props.fleet.aircraft.map((detail) => (
        <tr key={detail.id} className="bg-gray-50">
          <td>{detail.registration}</td>
          <td>Current Location: {detail.current_airport_id}</td>
          <td>
            <div className="flex items-center">
              <Link href={`/admin/aircraft/delete/${detail.id}`}>
                <Button variant="ghost" size="xs">
                  <Icon as={X} />
                </Button>
              </Link>
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}

export default FleetAircraft
