import { Box, Card, CardBody, CardHeader } from '@chakra-ui/react'
import { Inertia, Link, usePage } from '@inertiajs/react'
import React from 'react'

import AppLayout from '../../components/layout/AppLayout'

const RentalList = ({ aircraft, myRentals, currentAirport }) => {
  const { auth } = usePage().props

  const handleRental = (ac) => {
    const confirm = window.confirm(
      `Confirm you would like to rent a ${ac.manufacturer} ${ac.name} for $${
        ac.rental_cost
      }ph and a returnable deposit of $${ac.rental_cost * 10}`
    )
    if (confirm) {
      Inertia.post('/rentals', { aircraft: ac.id })
    }
  }

  const handleCancel = (ac) => {
    if (ac.current_airport_id !== ac.rental_airport_id) {
      const confirm = window.confirm(
        `Aircraft ${ac.registration} is not at its home location, if you end the rental now you will not get your deposit back. Do you wish to continue?`
      )
      if (confirm) {
        returnRental(ac)
      }
    } else {
      returnRental(ac)
    }
  }

  const returnRental = (ac) => {
    Inertia.post(`/rentals/end/${ac.id}`)
  }

  const RentalButton = (props) => {
    return (
      <div className="mt-6 text-center">
        <button
          onClick={() => handleRental(props.aircraft)}
          className="btn btn-secondary"
        >
          Rent {props.aircraft.name}
        </button>
      </div>
    )
  }

  const renderRentalButton = (ac) => {
    if (currentAirport.is_hub) {
      if (ac.rental_size === 1 && currentAirport.size >= 3) {
        return <RentalButton aircraft={ac} />
      } else if (ac.rental_size === 0) {
        return <RentalButton aircraft={ac} />
      } else {
        return (
          <div className="mt-4 text-center text-sm text-red-500">
            Aircraft not available here
          </div>
        )
      }
    }
  }

  return (
    <Box p={4}>
      <Box>
        <Box my={2}>
          <Card>
            <CardHeader>My Rentals</CardHeader>
            <CardBody>
              <Box className="overflow-x-auto">
                <table className="table table-compact w-full">
                  <thead>
                    <tr>
                      <th>Registration</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Home</th>
                      <th>Rental Cost (hour)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRentals &&
                      myRentals.map((ac) => (
                        <tr key={ac.id}>
                          <td>{ac.registration}</td>
                          <td>
                            {ac.fleet.manufacturer} {ac.fleet.name} (
                            {ac.fleet.type})
                          </td>
                          <td>
                            <Link href={`airports/${ac.current_airport_id}`}>
                              {ac.current_airport_id}
                            </Link>
                          </td>
                          <td>
                            <Link href={`airports/${ac.rental_airport_id}`}>
                              {ac.rental_airport_id}
                            </Link>
                          </td>
                          <td>${ac.fleet.rental_cost}</td>
                          <td>
                            <button
                              className="btn btn-secondary btn-xs"
                              onClick={() => handleCancel(ac)}
                            >
                              End rental
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </Box>
      <div className="mt-4">
        <h3 className="my-2">
          {currentAirport.is_hub ? (
            <span>
              Aircraft Available for Rental - {auth.user.current_airport_id}
            </span>
          ) : (
            <span>
              {auth.user.current_airport_id} -{' '}
              <span className="text-sm text-red-500">
                You must be at a hub to rent aircraft
              </span>
            </span>
          )}
        </h3>
        <div className="flex flex-wrap justify-start mt-2">
          {aircraft &&
            aircraft.map((ac) => (
              <div key={ac.id} className="w-1/4 mx-4 my-2">
                <Card>
                  <CardBody>
                    <img className="rounded-t" src={ac.rental_image} />
                    <div className="p-3">
                      <div className="text-xl">
                        {ac.type} {ac.manufacturer} - {ac.name}
                      </div>
                      <div className="mt-1">
                        ${ac.rental_cost} per hour{' '}
                        <span className="text-sm">(min. 2 hours per day)</span>
                      </div>
                      <div>${ac.rental_cost * 10} Returnable deposit</div>
                      <div className="mt-2">
                        <div>Cargo (lbs): {ac.cargo_capacity}</div>
                        <div>Pax: {ac.pax_capacity}</div>
                        <div>Fuel (gal): {ac.fuel_capacity}</div>
                        <div>Cruise (kts): {ac.cruise_speed}</div>
                        <div>Range (nm): {ac.range}</div>
                      </div>
                      {renderRentalButton(ac)}
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
        </div>
      </div>
    </Box>
  )
}

RentalList.layout = (page) => (
  <AppLayout
    children={page}
    title="Aircraft Rentals"
    heading="Aircraft Rentals"
  />
)

export default RentalList
