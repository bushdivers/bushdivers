import { Card, CardBody } from '@chakra-ui/react'
import React from 'react'

import HubJob from '../../components/community/HubJob.jsx'
import MissionJob from '../../components/community/MissionJob.jsx'
import AppLayout from '../../components/layout/AppLayout.jsx'

const Jobs = ({ hub, mission, fleet }) => {
  return (
    <>
      {hub ? (
        <HubJob hub={hub} />
      ) : mission ? (
        <MissionJob mission={mission} fleet={fleet} />
      ) : (
        <Card>
          <CardBody>No current missions, come back soon!</CardBody>
        </Card>
      )}
    </>
  )
}

Jobs.layout = (page) => (
  <AppLayout children={page} title="Community Jobs" heading="Community Jobs" />
)
export default Jobs
