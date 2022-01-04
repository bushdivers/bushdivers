import React from 'react'
// import NoContent from '../../Shared/Elements/NoContent'
// import { Link } from '@inertiajs/inertia-react'
// import Tooltip from '../../Shared/Elements/Tooltip'
import LiveFlightMap from '../../Shared/Components/Flights/LiveFlightMap'
import AppLayout from '../../Shared/AppLayout'
import StatBlock from '../../Shared/Elements/StatBlock'

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
    <div className="relative">
      <LiveFlightMap flights={flights} size="full" />
      <div className="absolute z-30 bg-gray-800 w-1/2 md:w-1/6 text-white opacity-80 h-auto top-4 left-4 p-4 rounded shadow">
        <StatBlock width="1/2" data={flights.length} text="Current Flights" />
      </div>
    </div>
  )
}

LiveFlights.layout = page => <AppLayout children={page} title="Live Flights" heading="Live Flights" />

export default LiveFlights
