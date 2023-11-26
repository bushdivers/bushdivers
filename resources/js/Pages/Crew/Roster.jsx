import React, { useEffect, useState } from 'react'
import { Link } from '@inertiajs/inertia-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from '../../Shared/Elements/Tooltip'
import { convertMinuteDecimalToHoursAndMinutes } from '../../Helpers/date.helpers'
import AppLayout from '../../Shared/AppLayout'
import { faPatreon } from '@fortawesome/free-brands-svg-icons'
import { Inertia } from '@inertiajs/inertia'
import Card from '../../Shared/Elements/Card'
import Select from '../../Shared/Elements/Forms/Select'

const Roster = ({ roster }) => {
  const [sortBy, setSortBy] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')

  useEffect(() => {
    setSortBy(Inertia.restore('sortBy'))
    setSortDirection(Inertia.restore('sortDirection'))
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
    <div>
      <div className="flex justify-end space-x-2">
        <div className="w-auto">
          <Select id="sort" value={sortBy} onChange={handleSortChange} options={[
            { value: 'id', text: 'Pilot Id' },
            { value: 'rank_id', text: 'Rank' },
            { value: 'flights', text: 'Flights' },
            { value: 'flights_time', text: 'Flight Time' }
          ]} />
        </div>
        <div className="w-auto">
          <Select id="direction" value={sortDirection} onChange={handleDirectionChange} options={[
            { value: 'asc', text: 'Asc' },
            { value: 'desc', text: 'Desc' }
          ]} />
        </div>
      </div>
      <div className="mt-4">
      <Card>
        <div className="overflow-x-auto">
          <table className="table w-full">
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
                    <div className="text-xl text-error">
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
      </Card>
      </div>
    </div>
  )
}

Roster.layout = page => <AppLayout children={page} title="Roster" heading="Pilot Roster" />

export default Roster
