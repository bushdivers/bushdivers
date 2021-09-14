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
    </div>
  )
}

LiveFlights.layout = page => <Layout children={page} title="Live Flights" />

export default LiveFlights
