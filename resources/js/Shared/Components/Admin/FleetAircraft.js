import React from 'react'
import { Link } from '@inertiajs/inertia-react'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const FleetAircraft = (props) => {
  return (
    <>
      {props.fleet.aircraft.map((detail) => (
        <tr key={detail.id} className="bg-gray-50">
          <td>{detail.registration}</td>
          <td>Current Location: {detail.current_airport_id}</td>
          <td>
            <div className="flex items-center">
              <Link href={`/admin/aircraft/delete/${detail.id}`} className="btn btn-light flex items-center">
                <FontAwesomeIcon icon={faClose} />
              </Link>
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}

export default FleetAircraft
