import { Card, CardBody, CardHeader } from '@chakra-ui/react'
import { Link, router } from '@inertiajs/react'
import axios from 'axios'
import React from 'react'

import AircraftCondition from '../../components/fleet/AircraftCondition'
import AppLayout from '../../components/layout/AppLayout'
import { convertMinuteDecimalToHoursAndMinutes } from '../../helpers/date.helpers'

const MyAircraft = ({ aircraft, rentals }) => {
  const handleSale = async (ac) => {
    const res = await axios.get(`/api/aircraft/price/${ac.id}`)
    if (res.status === 200) {
      if (
        window.confirm(
          `Are you sure you want to sell your aircraft ${ac.registration} for $${res.data.price}?`
        )
      ) {
        router.post(`/marketplace/sell/${ac.id}`)
      }
    }
  }

  return (
    <div className="p-4 flex space-x-4">
      <div className="w-full space-y-4">
        <div>
          <Card>
            <CardHeader>My Aircraft</CardHeader>
            <CardBody>
              <div className="flex justify-between items-baseline mt-2">
                <Link href="/marketplace">
                  <button className="btn btn-primary btn-sm">
                    Go To Marketplace
                  </button>
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-compact w-full my-2">
                  <thead>
                    <tr>
                      <th>Registration</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Home</th>
                      <th>Hours</th>
                      <th>Condition</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {aircraft &&
                      aircraft.map((ac) => (
                        <tr key={ac.id}>
                          <td>
                            <Link href={`/aircraft/${ac.id}`} className="link">
                              {ac.registration}
                            </Link>
                          </td>
                          <td>{ac.fleet.type}</td>
                          <td>{ac.current_airport_id}</td>
                          <td>{ac.hub_id}</td>
                          <td>
                            {convertMinuteDecimalToHoursAndMinutes(
                              ac.flight_time_mins
                            )}
                          </td>
                          <td>
                            <AircraftCondition aircraftCondition={ac.wear} />
                          </td>
                          <td>
                            <button
                              onClick={() => handleSale(ac)}
                              className="btn btn-xs btn-secondary"
                            >
                              Sell
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>My Rentals</CardHeader>
            <CardBody>
              <div className="flex justify-between items-baseline mt-2">
                <Link href="/rentals">
                  <button className="btn btn-primary btn-sm">
                    Go To Rentals
                  </button>
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-compact w-full my-2">
                  <thead>
                    <tr>
                      <th>Registration</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Home</th>
                      <th>Rental Cost (hour)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentals &&
                      rentals.map((ac) => (
                        <tr key={ac.id}>
                          <td>{ac.registration}</td>
                          <td>{ac.fleet.type}</td>
                          <td>{ac.current_airport_id}</td>
                          <td>{ac.hub_id}</td>
                          <td>${ac.fleet.rental_cost}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

MyAircraft.layout = (page) => (
  <AppLayout children={page} heading="My Aircraft" title="My Aircraft" />
)

export default MyAircraft
