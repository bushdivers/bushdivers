import { Badge, Card, CardBody } from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import { format } from 'date-fns'
import React from 'react'

import NoContent from '../../components/elements/NoContent'
import Pagination from '../../components/elements/Pagination'
import AppLayout from '../../components/layout/AppLayout'
import { convertMinuteDecimalToHoursAndMinutes } from '../../helpers/date.helpers'

const EmptyData = () => {
  return (
    <>
      <i className="material-icons md-48">airplane_landing</i>
      <div>There are no logbook entries</div>
    </>
  )
}

const Logbook = ({ logbook }) => {
  function loadPirep(pirep) {
    router.get(`/logbook/${pirep.id}`)
  }

  return (
    <div>
      <p className="text-sm mb-1">
        {logbook.length > 0 && <span>Total pireps: {logbook.length} </span>}{' '}
      </p>
      <div>
        <Card>
          <CardBody>
            {logbook.length === 0 ? (
              <NoContent content={<EmptyData />} />
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Departure</th>
                      <th>Arrival</th>
                      <th>Time</th>
                      <th>Distance</th>
                      <th>Points</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logbook.data.map((entry) => (
                      <tr key={entry.id}>
                        <td
                          className="text-primary cursor-pointer"
                          onClick={() => loadPirep(entry)}
                        >
                          <span className="hover:underline">View Pirep</span>
                          {entry.state === 5 && (
                            <span className="px-2 ml-2">
                              <Badge label="Review" color="primary" />
                            </span>
                          )}
                        </td>
                        <td>
                          {entry.departure_airport_id}
                          <br />
                          <span className="text-xs">
                            {entry.dep_airport.name}
                          </span>
                        </td>
                        <td>
                          {entry.destination_airport_id}
                          <br />
                          <span className="text-xs">
                            {entry.arr_airport.name}
                          </span>
                        </td>
                        <td>
                          {convertMinuteDecimalToHoursAndMinutes(
                            entry.flight_time
                          )}
                        </td>
                        <td>
                          {entry.distance &&
                            entry.distance.toLocaleString(navigator.language)}
                          nm
                        </td>
                        <td>
                          {entry.score &&
                            entry.score.toLocaleString(navigator.language)}
                        </td>
                        <td>
                          {format(
                            new Date(entry.submitted_at),
                            'dd LLL yyyy hh:mm',
                            { timeZone: 'UTC' }
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
        <div className="mt-2">
          <Pagination pages={logbook} />
        </div>
      </div>
    </div>
  )
}

Logbook.layout = (page) => (
  <AppLayout children={page} title="Logbook" heading="Logbook" />
)

export default Logbook
