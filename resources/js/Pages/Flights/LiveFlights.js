import React, { useState } from 'react'
// import NoContent from '../../Shared/Elements/NoContent'
// import { Link } from '@inertiajs/inertia-react'
// import Tooltip from '../../Shared/Elements/Tooltip'
import LiveFlightMap from '../../Shared/Components/Flights/LiveFlightMap'
import AppLayout from '../../Shared/AppLayout'
import StatBlock from '../../Shared/Elements/StatBlock'
import { usePage } from '@inertiajs/inertia-react'

// const EmptyData = () => {
//   return (
//     <>
//       <i className="material-icons md-48">airplane_ticket</i>
//       <div>There are no current flights</div>
//     </>
//   )
// }

const LiveFlights = () => {
  const { auth } = usePage().props
  const [flightCount, setFlightCount] = useState(0)
  const updateFlightCount = (count) => {
    setFlightCount(count)
  }

  return (
    <div className="relative">
      <LiveFlightMap size="full" updateFlightCount={updateFlightCount} mapStyle={auth.user.map_style} />
      <div className="absolute z-30 bg-white w-1/2 md:w-1/6 opacity-80 h-auto top-4 left-4 p-4 rounded shadow">
        <StatBlock width="1/2" data={flightCount} text="Current Flights" />
      </div>
    </div>
  )
}

LiveFlights.layout = page => <AppLayout children={page} title="Live Flights" heading="Live Flights" />

export default LiveFlights
