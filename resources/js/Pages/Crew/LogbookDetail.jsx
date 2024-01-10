import { Badge } from '@chakra-ui/react'
import { usePage } from '@inertiajs/react'
import { format } from 'date-fns'
import React from 'react'

import AppLayout from '../../components/layout/AppLayout'
import LandingSummary from '../../components/pirep/LandingSummary'
import LogbookPrimary from '../../components/pirep/LogbookPrimary'
import LogbookSecondary from '../../components/pirep/LogbookSecondary'
import PirepCargo from '../../components/pirep/PirepCargo'
import PirepFinancials from '../../components/pirep/PirepFinancials'
import PirepMap from '../../components/pirep/PirepMap'
import Points from '../../components/pirep/Points'

const LogbookDetail = ({
  pirep,
  points,
  logs,
  cargo,
  pilotFinancials,
  companyFinancials,
  companyTotal,
  pilotTotal,
}) => {
  const { auth } = usePage().props
  const submittedDate = format(
    new Date(pirep.submitted_at),
    'do MMMM yyyy kk:mm'
  )
  return (
    <div>
      <h2>{`Pilot Report - ${pirep.id}`}</h2>
      {submittedDate}{' '}
      {auth.user.is_admin ? (
        <span>
          {pirep.pilot.pilot_id} - {pirep.pilot.private_name}
        </span>
      ) : (
        ''
      )}
      {pirep.state === 5 ? (
        <span className="ml-2">
          <Badge color="primary" label="Review" />
        </span>
      ) : (
        <span className="ml-2">
          <Badge color="success" label="Completed" />
        </span>
      )}
      <div className="flex flex-col md:flex-row justify-between">
        <div className="md:w-1/2">
          <LogbookPrimary pirep={pirep} />
          <LogbookSecondary pirep={pirep} />
          <Points points={points} />
          <PirepCargo cargo={cargo} />
          {/* <div className="mt-2 mx-2"> */}
          {/*  <PirepChart data={logs} /> */}
          {/* </div> */}
          <PirepFinancials
            company={companyFinancials}
            pilot={pilotFinancials}
            companyTotal={companyTotal}
            pilotTotal={pilotTotal}
          />
        </div>
        <div className="md:w-1/2">
          <div className="mt-2 mx-2">
            <PirepMap
              pirep={pirep}
              coords={logs}
              size="small"
              mapStyle={auth.user.map_style}
            />
          </div>
          <LandingSummary pirep={pirep} mapStyle={auth.user.map_style} />
        </div>
      </div>
    </div>
  )
}

LogbookDetail.layout = (page) => (
  <AppLayout children={page} title="Pirep Details" heading="Pirep Details" />
)

export default LogbookDetail
