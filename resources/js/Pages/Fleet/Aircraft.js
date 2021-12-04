import React from 'react'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'
import StatCard from '../../Shared/Elements/StatCard'
import { convertMinuteDecimalToHoursAndMinutes } from '../../Helpers/date.helpers'
import AircraftMap from '../../Shared/Components/Fleet/AircraftMap'

const Aircraft = ({ aircraft }) => {
  const calculateDistanceFlown = (pireps) => {
    return pireps.reduce((a, pirep) => {
      return a + pirep.distance
    }, 0)
  }

  return (
    <div>
      <PageTitle title={`${aircraft.registration} - ${aircraft.fleet.manufacturer} ${aircraft.fleet.name} (${aircraft.fleet.type})`} />
      <div className="flex flex-col md:flex-row justify-between">
        <div className="md:w-1/6 my-1">
          <StatCard title="Flights" stat={aircraft.pireps.length} />
        </div>
        <div className="md:w-1/6 my-1">
          <StatCard title="Airframe Time" stat={convertMinuteDecimalToHoursAndMinutes(aircraft.flight_time_mins)} />
        </div>
        <div className="md:w-1/6 my-1">
          <StatCard title="Distance Flown" stat={calculateDistanceFlown(aircraft.pireps).toLocaleString(navigator.language)} />
        </div>
        <div className="md:w-1/6 my-1">
          <StatCard title="Current Location" stat={aircraft.current_airport_id} />
        </div>
        <div className="md:w-1/6 my-1">
          <StatCard title="Current Fuel" stat={aircraft.fuel_onboard.toLocaleString(navigator.language)} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between mt-4">
        <div className="md:w-1/2 mx-2">
          <div className="bg-white p-4 rounded shadow overflow-x-auto">
            <table className="table table-auto table-condensed">
              <thead>
              <tr>
                <th>Date</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Distance</th>
                <th>Time</th>
              </tr>
              </thead>
              <tbody>
              {aircraft.pireps.map((pirep) => (
                <tr key={pirep.id}>
                  <td>{pirep.submitted_at}</td>
                  <td>{pirep.departure_airport_id}</td>
                  <td>{pirep.destination_airport_id}</td>
                  <td>{pirep.distance.toLocaleString(navigator.language)}</td>
                  <td>{convertMinuteDecimalToHoursAndMinutes(pirep.flight_time)}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="md:w-1/2 mx-1">
          <div className="bg-white p-4 rounded shadow overflow-x-auto">
            <AircraftMap aircraft={aircraft} size="large" />
          </div>
        </div>
      </div>
    </div>
  )
}

Aircraft.layout = page => <Layout children={page} title="Aircraft Details" />

export default Aircraft
