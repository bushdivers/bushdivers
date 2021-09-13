import React from 'react'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'
// import NoContent from '../../Shared/Elements/NoContent'
// import { Link } from '@inertiajs/inertia-react'
// import Tooltip from '../../Shared/Elements/Tooltip'
import LiveFlightMap from '../../Shared/Components/Flights/LiveFlightMap'

// const EmptyData = () => {
//   return (
//     <>
//       <i className="material-icons md-48">airplane_ticket</i>
//       <div>There are no current flights</div>
//     </>
//   )
// }

const LiveFlights = ({ flights }) => {
  return (
    <div>
      <PageTitle title="Live Flights" />
      <LiveFlightMap flights={flights} size="xl" />
      {/* <div className="bg-white rounded shadow overflow-x-auto mt-4"> */}
      {/* {flights.length === 0 */}
      {/*  ? <NoContent content={<EmptyData/>}/> */}
      {/*  : ( */}
      {/*    <div> */}
      {/*      <table className="table table-auto"> */}
      {/*        <thead> */}
      {/*        <tr> */}
      {/*          <th>Pilot</th> */}
      {/*          <th>Flight</th> */}
      {/*          <th>Departure</th> */}
      {/*          <th>Arrival</th> */}
      {/*          <th>Aircraft</th> */}
      {/*          <th>Speed</th> */}
      {/*          <th>Altitude</th> */}
      {/*          <th>Vertical Speed</th> */}
      {/*        </tr> */}
      {/*        </thead> */}
      {/*        <tbody> */}
      {/*        {flights && flights.map((flight) => ( */}
      {/*          <tr key={flight.id}> */}
      {/*            <td>{flight.pilot.pilot_id} {flight.pilot.private_name}</td> */}
      {/*            <td className="hover:underline hover:text-orange-500">{flight.flight.full_flight_number}</td> */}
      {/*            <td> */}
      {/*              <Link href={`/airports/${flight.flight.dep_airport_id}`}>{flight.flight.dep_airport_id}</Link><br/> */}
      {/*              <span className="text-xs">{flight.flight.dep_airport.name}</span> */}
      {/*            </td> */}
      {/*            <td> */}
      {/*              <Link href={`/airports/${flight.flight.arr_airport_id}`}>{flight.flight.arr_airport_id}</Link><br/> */}
      {/*              <span className="text-xs">{flight.flight.arr_airport.name}</span> */}
      {/*            </td> */}
      {/*            <td>{flight.aircraft.fleet.manufacturer} {flight.aircraft.fleet.name} - {flight.aircraft.registration}</td> */}
      {/*            <td>{flight.current_ground_speed}</td> */}
      {/*            <td>{flight.current_altitude}</td> */}
      {/*            <td>{flight.current_vs}</td> */}
      {/*          </tr> */}
      {/*        ))} */}
      {/*        </tbody> */}
      {/*      </table> */}
      {/*    </div> */}
      {/*    ) */}
      {/* } */}
      {/* </div> */}
    </div>
  )
}

LiveFlights.layout = page => <Layout children={page} title="Live Flights" />

export default LiveFlights
