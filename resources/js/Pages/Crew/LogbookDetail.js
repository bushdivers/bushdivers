import React from 'react'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'
import PirepMap from '../../Shared/Pireps/PirepMap'
import Points from '../../Shared/Pireps/Points'
import LogbookPrimary from '../../Shared/Pireps/LogbookPrimary'
import LogbookSecondary from '../../Shared/Pireps/LogbookSecondary'

const LogbookDetail = ({ pirep, points, logs, coords }) => {
  return (
    <div>
      <PageTitle title={`Pilot Report - ${pirep.flight.full_flight_number}`} />
      <div className="flex justify-between">
        <div className="w-1/2">
          <LogbookPrimary pirep={pirep} />
          <LogbookSecondary pirep={pirep} />
          <Points points={points} />
        </div>
        <div className="w-1/2">
          <div className="rounded shadow p-4 mt-2 bg-white mx-2">
            <PirepMap pirep={pirep} coords={coords} size="large" />
          </div>
        </div>
      </div>
    </div>
  )
}

LogbookDetail.layout = page => <Layout children={page} title="Pirep Details" />

export default LogbookDetail
