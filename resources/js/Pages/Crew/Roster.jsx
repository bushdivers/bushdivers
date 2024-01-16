import { Card, CardBody, Select } from '@chakra-ui/react'
import { Link, router } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'

import Tooltip from '../../components/elements/Tooltip'
import AppLayout from '../../components/layout/AppLayout'
import { convertMinuteDecimalToHoursAndMinutes } from '../../helpers/date.helpers'

const Roster = ({ roster }) => {
  const [sortBy, setSortBy] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')

  useEffect(() => {
    setSortBy(router.restore('sortBy'))
    setSortDirection(router.restore('sortDirection'))
  })

  function handleSortChange(e) {
    router.remember(e.target.value, 'sortBy')
    setSortBy(e.target.value)
    updateRoster()
  }

  function handleDirectionChange(e) {
    router.remember(e.target.value, 'sortDirection')
    setSortDirection(e.target.value)
    updateRoster()
  }

  function updateRoster() {
    router.post('/roster', {
      sortBy: router.restore('sortBy'),
      direction: router.restore('sortDirection'),
    })
  }

  return (
    <div>
      <div className="flex justify-end space-x-2">
        <div className="w-auto">
          <Select
            id="sort"
            placeholder="Select option"
            onChange={handleSortChange}
            value={sortBy}
          >
            <option value="id">Pilot Id</option>
            <option value="rank_id">Rank</option>
            <option value="flights">Flights</option>
            <option value="flights_time">Flight Time</option>
          </Select>
        </div>
        <div className="w-auto">
          <Select
            id="direction"
            onChange={handleDirectionChange}
            value={sortDirection}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </Select>
        </div>
      </div>
      <div className="mt-4">
        <Card>
          <CardBody>
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
                            {user.is_supporter ? <>P</> : <></>}
                          </div>
                          <div>
                            <span>{user.pilot_id}</span>
                            <br />
                            <span className="text-xs">{user.private_name}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Link
                          href={`/airports/${user.current_airport_id}`}
                          className="text-xs"
                        >
                          {user.current_airport_id}
                        </Link>
                        <br />
                        <span className="text-xs">{user.location.name}</span>
                      </td>
                      <td>{user.flights}</td>
                      <td>
                        {convertMinuteDecimalToHoursAndMinutes(
                          user.flights_time
                        )}
                      </td>
                      <td>{user.discord_username}</td>
                      <td>{user.volanta_username}</td>
                      <td>{user.msfs_username}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

Roster.layout = (page) => (
  <AppLayout children={page} title="Roster" heading="Pilot Roster" />
)

export default Roster
