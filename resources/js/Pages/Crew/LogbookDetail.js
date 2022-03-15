import React from 'react'
import { format } from 'date-fns'
import PirepMap from '../../Shared/Components/Pireps/PirepMap'
import Points from '../../Shared/Components/Pireps/Points'
import LogbookPrimary from '../../Shared/Components/Pireps/LogbookPrimary'
import LogbookSecondary from '../../Shared/Components/Pireps/LogbookSecondary'
import PirepChart from '../../Shared/Components/Pireps/PirepChart'
import PirepCargo from '../../Shared/Components/Pireps/PirepCargo'
import LandingSummary from '../../Shared/Components/Pireps/LandingSummary'
import { usePage } from '@inertiajs/inertia-react'
import PirepFinancials from '../../Shared/Components/Pireps/PirepFinancials'
import AppLayout from '../../Shared/AppLayout'

const LogbookDetail = ({ pirep, points, logs, cargo, pilotFinancials, companyFinancials, companyTotal, pilotTotal }) => {
  const { auth } = usePage().props
  const submittedDate = format(new Date(pirep.submitted_at), 'do MMMM yyyy kk:mm')
  return (
    <div className="p-4">
      <h1>{`Pilot Report - ${pirep.id}`}</h1>
      {submittedDate} {auth.user.is_admin ? <span>{pirep.pilot.pilot_id} - {pirep.pilot.private_name}</span> : ''}
      {pirep.state === 5 ? <span className="bg-orange-500 px-2 ml-2 text-white text-sm rounded">Review</span> : <span className="bg-green-500 px-2 ml-2 text-white text-sm rounded">Completed</span>}
      <div className="flex flex-col md:flex-row justify-between">
        <div className="md:w-1/2">
          <LogbookPrimary pirep={pirep} />
          <LogbookSecondary pirep={pirep} />
          <Points points={points} />
          <PirepCargo cargo={cargo} />
          <div className="rounded shadow p-4 mt-2 bg-white mx-2">
            <PirepChart data={logs} />
          </div>
          <PirepFinancials company={companyFinancials} pilot={pilotFinancials} companyTotal={companyTotal} pilotTotal={pilotTotal} />
        </div>
        <div className="md:w-1/2">
          <div className="rounded shadow p-4 mt-2 bg-white mx-2">
            <PirepMap pirep={pirep} coords={logs} size="small" mapStyle={auth.user.map_style} />
          </div>
          <LandingSummary pirep={pirep} mapStyle={auth.user.map_style} />
        </div>
      </div>
    </div>
  )
}

LogbookDetail.layout = page => <AppLayout children={page} title="Pirep Details" heading="Pirep Details" />

export default LogbookDetail
