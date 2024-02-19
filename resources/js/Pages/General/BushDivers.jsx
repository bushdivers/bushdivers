import {
  Card,
  CardBody,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import React from 'react'

import AppLayout from '../../Components/Layout/AppLayout.jsx'
import HubMap from '../../Components/airport/HubMap.jsx'
import CompanyFinances from '../../Components/finances/CompanyFinances.jsx'
import FleetDetails from '../../Components/fleet/FleetDetails.jsx'

const BushDivers = ({ hubs, fleet, finances }) => {
  return (
    <Tabs>
      <TabList>
        <Tab>Fleet</Tab>
        <Tab>Hubs</Tab>
        <Tab>Finances</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Card>
            <CardBody>
              <FleetDetails fleet={fleet} />
            </CardBody>
          </Card>
        </TabPanel>
        <TabPanel>
          <Card>
            <CardBody>
              <HubMap hubs={hubs} />
            </CardBody>
          </Card>
        </TabPanel>
        <TabPanel>
          <Card>
            <CardBody>
              <CompanyFinances finances={finances} />
            </CardBody>
          </Card>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

BushDivers.layout = (page) => (
  <AppLayout children={page} title="HQ" heading="Bush Divers HQ" />
)

export default BushDivers
