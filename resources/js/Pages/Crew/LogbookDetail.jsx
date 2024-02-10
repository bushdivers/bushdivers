import { Badge, Box, Flex, Heading, SimpleGrid } from '@chakra-ui/react'
import { usePage } from '@inertiajs/react'
import React from 'react'

import AppLayout from '../../components/layout/AppLayout'
import LandingSummary from '../../components/pirep/LandingSummary'
import LogbookPrimary from '../../components/pirep/LogbookPrimary'
import LogbookSecondary from '../../components/pirep/LogbookSecondary'
import PirepCargo from '../../components/pirep/PirepCargo'
import PirepFinancials from '../../components/pirep/PirepFinancials'
import PirepMap from '../../components/pirep/PirepMap'
import Points from '../../components/pirep/Points'
import { formatDate } from '../../helpers/date.helpers'

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
  const submittedDate = formatDate(pirep.submitted_at)
  return (
    <Box>
      <Flex my={2} alignItems="center">
        <Heading size="sm">
          {submittedDate}{' '}
          {auth.user.is_admin ? (
            <span>
              {pirep.pilot.pilot_id} - {pirep.pilot.private_name}
            </span>
          ) : (
            ''
          )}
        </Heading>
        {pirep.state === 5 ? (
          <Badge ml={2} colorScheme="orange" fontSize="0.7em">
            Review
          </Badge>
        ) : (
          <Badge ml={2} colorScheme="orange" fontSize="0.7em">
            Completed
          </Badge>
        )}
      </Flex>
      <SimpleGrid columns={2} spacing={10}>
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

        <div className="mt-2 mx-2">
          <PirepMap
            pirep={pirep}
            coords={logs}
            size="small"
            mapStyle={auth.user.map_style}
          />
        </div>
        <LandingSummary pirep={pirep} mapStyle={auth.user.map_style} />
      </SimpleGrid>
    </Box>
  )
}

LogbookDetail.layout = (page) => (
  <AppLayout children={page} title="Pirep Details" heading="Pirep Details" />
)

export default LogbookDetail
