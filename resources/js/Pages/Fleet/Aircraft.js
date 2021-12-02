import React from 'react'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'
import StatCard from '../../Shared/Elements/StatCard'
import { convertMinuteDecimalToHoursAndMinutes } from '../../Helpers/date.helpers'
import AircraftMap from '../../Shared/Components/Fleet/AircraftMap'

const Aircraft = ({ aircraft, maintenanceStatus }) => {
  console.log(aircraft)
  const calculateDistanceFlown = (pireps) => {
    return pireps.reduce((a, pirep) => {
      return a + pirep.distance
    }, 0)
  }

  return (
    <div>
      <div className="flex justify-start items-center">
        <PageTitle title={`${aircraft.registration} - ${aircraft.fleet.manufacturer} ${aircraft.fleet.name} (${aircraft.fleet.type})`} />
        {maintenanceStatus && <div className="ml-2 text-orange-500"><i className="material-icons md-36">engineering</i></div>}
      </div>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="md:w-1/5 my-1">
          <StatCard title="Flights" stat={aircraft.pireps.length} />
        </div>
        <div className="md:w-1/5 my-1">
          <StatCard title="Distance Flown" stat={calculateDistanceFlown(aircraft.pireps)} />
        </div>
        <div className="md:w-1/5 my-1">
          <StatCard title="Current Location" stat={aircraft.current_airport_id} />
        </div>
        <div className="md:w-1/5 my-1">
          <StatCard title="Current Fuel" stat={aircraft.fuel_onboard} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between mt-4">
        <div className="md:w-1/2 mx-2">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="md:w-1/3 my-1">
              <StatCard title="Airframe Time" stat={(aircraft.flight_time_mins / 60).toFixed(2)} />
            </div>
            <div className="md:w-1/3 my-1">
              <StatCard title="Time since 100hr" stat={(aircraft.mins_since_100hr / 60).toFixed(2)} />
            </div>
            <div className="md:w-1/3 my-1">
              <StatCard title="TBO Interval" stat={(aircraft.fleet.tbo_mins / 60)} />
            </div>
          </div>
          <div className="bg-white p-4 rounded shadow overflow-x-auto my-2">
            <div className="text-lg mb-2">Maintenance</div>
            <table className="table table-auto table-condensed">
              <thead>
              <tr>
                <th>Engine #</th>
                <th>Time since TBO</th>
              </tr>
              </thead>
              <tbody>
              {aircraft.engines.map((engine) => (
                <tr key={engine.id}>
                  <td>{engine.engine_no}</td>
                  <td>{(engine.mins_since_tbo / 60).toFixed(2)}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white p-4 rounded shadow overflow-x-auto">
            <div className="text-lg mb-2">Flights</div>
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
                  <td>{pirep.distance}</td>
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
