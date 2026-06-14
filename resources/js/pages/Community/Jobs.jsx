import { Card, CardBody } from '@chakra-ui/react'
import React from 'react'

import CommunityJob from '../../components/community/CommunityJob.jsx'
import AppLayout from '../../components/layout/AppLayout.jsx'

const Jobs = ({ hub, mission }) => {
  if (!hub && !mission) {
    return (
      <Card>
        <CardBody>No current jobs, come back soon!</CardBody>
      </Card>
    )
  }

  return <CommunityJob hub={hub} mission={mission} />
}

Jobs.layout = (page) => (
  <AppLayout children={page} title="Community Jobs" heading="Community Jobs" />
)
export default Jobs
