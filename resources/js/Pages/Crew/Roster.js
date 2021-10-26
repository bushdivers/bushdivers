import React from 'react'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'
import { Link } from '@inertiajs/inertia-react'
import Tooltip from '../../Shared/Elements/Tooltip'
import { convertMinuteDecimalToHoursAndMinutes } from '../../Helpers/date.helpers'

const Roster = ({ roster }) => {
  return (
    <div>
      <PageTitle title="Roster" />
      <div className="rounded shadow bg-white mt-4 overflow-x-auto">
        <div>
          <table className="table table-auto">
            <thead>
            <tr>
              <th>Rank</th>
              <th>Pilot</th>
              <th>Current Location</th>
              <th>Flights</th>
              <th>Hours</th>
              <th>Discord</th>
              <th>Volanta</th>
              <th>MSFS</th>
            </tr>
            </thead>
            <tbody>
            {roster.map((user) => (
              <tr key={user.id}>
                <td>
                  <Tooltip content={user.rank.name} direction="top">
                    <img src={user.rank.image} width="80" />
                  </Tooltip>
                </td>
                <td>
                  <span>{user.pilot_id}</span><br/>
                  <span className="text-xs">{user.private_name}</span>
                </td>
                <td>
                  <Link href={`/airports/${user.current_airport_id}`} className="text-xs">{user.current_airport_id}</Link><br/>
                  <span className="text-xs">{user.location.name}</span>
                </td>
                <td>{user.flights}</td>
                <td>
                  {convertMinuteDecimalToHoursAndMinutes(user.flights_time)}
                </td>
                <td>
                  {user.discord_username}
                </td>
                <td>
                  {user.volanta_username}
                </td>
                <td>
                  {user.msfs_username}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

Roster.layout = page => <Layout children={page} title="Roster" />

export default Roster
