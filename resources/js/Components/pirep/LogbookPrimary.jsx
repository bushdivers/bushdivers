import { Card, CardBody, Icon } from '@chakra-ui/react'
import { Link } from '@inertiajs/inertia-react'
import { format } from 'date-fns'
import { PlaneLanding, PlaneTakeoff } from 'lucide-react'
import React from 'react'

const LogbookPrimary = ({ pirep }) => {
  return (
    <div className="mt-2 mx-2">
      <Card>
        <CardBody>
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center my-2 mx-4">
              <div className="text-sm">
                <Icon as={PlaneTakeoff} />
              </div>
              <div className="text-xl">
                <Link href={`/airports/${pirep.departure_airport_id}`}>
                  {pirep.departure_airport_id}
                </Link>
              </div>
              <div className="text-sm">{pirep.dep_airport.name}</div>
              <div className="text-xs">
                {format(new Date(pirep.block_off_time), 'kk:mm')}
              </div>
            </div>
            <div className="flex flex-col items-center my-2 mx-4">
              <div className="text-sm">
                <Icon as={PlaneLanding} />
              </div>
              <div className="text-xl">
                <Link href={`/airports/${pirep.destination_airport_id}`}>
                  {pirep.destination_airport_id}
                </Link>
              </div>
              <div className="text-sm">{pirep.arr_airport.name}</div>
              <div className="text-xs">
                {format(new Date(pirep.block_on_time), 'kk:mm')}
              </div>
            </div>
            <div className="flex flex-col items-center my-2 mx-4">
              <div className="text-sm">
                {pirep.is_rental ? (
                  <span>
                    {pirep.rental.fleet.manufacturer} {pirep.rental.fleet.name}
                  </span>
                ) : (
                  <span>
                    {pirep.aircraft.fleet.manufacturer}{' '}
                    {pirep.aircraft.fleet.name}
                  </span>
                )}
              </div>
              <div className="text-xl">
                {pirep.is_rental ? (
                  <span>
                    {pirep.rental.registration} ({pirep.rental.fleet.type})
                  </span>
                ) : (
                  <Link href={`/aircraft/${pirep.aircraft.id}`}>
                    {pirep.aircraft.registration} ({pirep.aircraft.fleet.type})
                  </Link>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default LogbookPrimary
