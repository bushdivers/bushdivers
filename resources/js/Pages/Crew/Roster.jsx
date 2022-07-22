import React, { useEffect, useState } from 'react'
import { Link, useRemember } from '@inertiajs/inertia-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from '../../Shared/Elements/Tooltip'
import { convertMinuteDecimalToHoursAndMinutes } from '../../Helpers/date.helpers'
import AppLayout from '../../Shared/AppLayout'
import { faPatreon } from '@fortawesome/free-brands-svg-icons'
import Pagination from '../../Shared/Elements/Pagination'
import { Inertia } from '@inertiajs/inertia'

const Roster = ({ roster }) => {
  const [sortBy, setSortBy] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')

  useEffect(() => {
    setSortBy(Inertia.restore('sortBy'))
    setSortDirection(Inertia.restore('sortDirection'))
    console.log(sortBy)
  })

  function handleSortChange (e) {
    Inertia.remember(e.target.value, 'sortBy')
    setSortBy(e.target.value)
    updateRoster()
  }

  function handleDirectionChange (e) {
    Inertia.remember(e.target.value, 'sortDirection')
    setSortDirection(e.target.value)
    updateRoster()
  }

  function updateRoster () {
    Inertia.post('/roster', {
      sortBy: Inertia.restore('sortBy'),
      direction: Inertia.restore('sortDirection')
    })
  }

  return (
    <div className="p-4">
      <div className="flex justify-end space-x-2">
        <div className="w-1/6">
          <select id="sort" value={sortBy} onChange={handleSortChange}
                  className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5">
            <option value="id">Pilot Id</option>
            <option value="rank_id">Rank</option>
            <option value="flights">Flights</option>
            <option value="flights_time">Flight Time</option>
          </select>
        </div>
        <div className="w-1/8">
          <select id="direction" value={sortDirection} onChange={handleDirectionChange}
                  className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5">
            <option value="asc">asc</option>
            <option value="desc">desc</option>
          </select>
        </div>
      </div>
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
                  <div className="flex justify-start items-center space-x-2">
                    <div className="text-xl text-red-300">
                      {user.is_supporter ? <FontAwesomeIcon icon={faPatreon} /> : <></>}
                    </div>
                    <div>
                      <span>{user.pilot_id}</span><br/>
                      <span className="text-xs">{user.private_name}</span>
                    </div>
                  </div>
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

Roster.layout = page => <AppLayout children={page} title="Roster" heading="Pilot Roster" />

export default Roster
