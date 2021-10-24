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
import { usePage } from '@inertiajs/inertia-react'
import PirepFinancials from '../../Shared/Pireps/PirepFinancials'

const LogbookDetail = ({ pirep, points, logs, cargo, pilotFinancials, companyFinancials, flightTotal }) => {
  const { auth } = usePage().props
  const submittedDate = format(new Date(pirep.submitted_at), 'do MMMM yyyy hh:mm', { timeZone: 'UTC' })
  return (
    <div>
      <PageTitle title={`Pilot Report - ${pirep.id}`} />
      {submittedDate} {auth.user.is_admin && <span>{pirep.pilot.pilot_id} - {pirep.pilot.private_name}</span>}
      <div className="flex flex-col md:flex-row justify-between">
        <div className="md:w-1/2">
          <LogbookPrimary pirep={pirep} />
          <LogbookSecondary pirep={pirep} />
          <Points points={points} />
          <PirepCargo cargo={cargo} />
          <div className="rounded shadow p-4 mt-2 bg-white mx-2">
            <PirepChart data={logs} />
          </div>
          <PirepFinancials company={companyFinancials} pilot={pilotFinancials} total={flightTotal} />
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
