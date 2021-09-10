import React from 'react'
import { format } from 'date-fns'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'
import PirepMap from '../../Shared/Pireps/PirepMap'
import Points from '../../Shared/Pireps/Points'
import LogbookPrimary from '../../Shared/Pireps/LogbookPrimary'
import LogbookSecondary from '../../Shared/Pireps/LogbookSecondary'
import PirepChart from '../../Shared/Pireps/PirepChart'

const LogbookDetail = ({ pirep, points, logs }) => {
  const submittedDate = format(new Date(pirep.submitted_at), 'do MMMM yyyy')
  return (
    <div>
      <PageTitle title={`Pilot Report - ${pirep.flight.full_flight_number}`} />
      {submittedDate}
      <div className="flex justify-between">
        <div className="w-1/2">
          <LogbookPrimary pirep={pirep} />
          <LogbookSecondary pirep={pirep} />
          <div className="rounded shadow p-4 mt-2 bg-white mx-2">
            <PirepChart data={logs} />
          </div>
        </div>
        <div className="w-1/2">
          <div className="rounded shadow p-4 mt-2 bg-white mx-2">
            <PirepMap pirep={pirep} coords={logs} size="large" />
          </div>
          <Points points={points} />
        </div>
      </div>
    </div>
  )
}

LogbookDetail.layout = page => <Layout children={page} title="Pirep Details" />

export default LogbookDetail
