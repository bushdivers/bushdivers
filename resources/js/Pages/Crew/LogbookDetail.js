import React from 'react'
import { format } from 'date-fns'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'
import PirepMap from '../../Shared/Pireps/PirepMap'
import Points from '../../Shared/Pireps/Points'
import LogbookPrimary from '../../Shared/Pireps/LogbookPrimary'
import LogbookSecondary from '../../Shared/Pireps/LogbookSecondary'
import PirepChart from '../../Shared/Pireps/PirepChart'
import PirepCargo from '../../Shared/Pireps/PirepCargo'
import LandingSummary from '../../Shared/Pireps/LandingSummary'

const LogbookDetail = ({ pirep, points, logs, cargo }) => {
  const submittedDate = format(new Date(pirep.submitted_at), 'do MMMM yyyy')
  return (
    <div>
      <PageTitle title={`Pilot Report - ${pirep.id}`} />
      {submittedDate}
      <div className="flex flex-col md:flex-row justify-between">
        <div className="md:w-1/2">
          <LogbookPrimary pirep={pirep} />
          <LogbookSecondary pirep={pirep} />
          <Points points={points} />
          <PirepCargo cargo={cargo} />
          <div className="rounded shadow p-4 mt-2 bg-white mx-2">
            <PirepChart data={logs} />
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="rounded shadow p-4 mt-2 bg-white mx-2">
            <PirepMap pirep={pirep} coords={logs} size="small" />
          </div>
          <LandingSummary pirep={pirep} />
        </div>
      </div>
    </div>
  )
}

LogbookDetail.layout = page => <Layout children={page} title="Pirep Details" />

export default LogbookDetail
