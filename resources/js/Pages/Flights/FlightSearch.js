import React from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'
import NoContent from '../../Shared/Elements/NoContent'
import Tooltip from '../../Shared/Elements/Tooltip'

const EmptyData = () => {
  return (
    <>
      <i className="material-icons md-48">airplane_ticket</i>
      <div>There are no flights</div>
    </>
  )
}

const FlightSearch = ({ flights }) => {
  return (
    <div>
      <PageTitle title="Flight Search" />
      <div className="bg-white rounded shadow">
        {!flights
          ? <NoContent content={<EmptyData />} />
          : (
              <table className="table table-auto">
                <thead>
                <tr>
                  <th>Flight</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Distance</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {flights.map((flight) => (
                  <tr key={flight.id}>
                    <td>BDV{flight.flight_number}</td>
                    <td>{flight.dep_airport_id}</td>
                    <td>{flight.arr_airport_id}</td>
                    <td>{flight.distance}</td>
                    <td>
                      <Tooltip content="Book flight" direction="top">
                        <button className="btn btn-secondary flex items-center">
                          <i className="material-icons">airplane_ticket</i>
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            )
        }
      </div>
    </div>
  )
}

FlightSearch.layout = page => <Layout children={page} title="Flight Search" />

export default FlightSearch
