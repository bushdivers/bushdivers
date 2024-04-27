import {
  Card,
  CardBody,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { usePage, useRemember } from '@inertiajs/react'
import React, { useState } from 'react'

import HubMap from '../../components/airport/HubMap.jsx'
import CompanyFinances from '../../components/finances/CompanyFinances.jsx'
import FleetDetails from '../../components/fleet/FleetDetails.jsx'
import AppLayout from '../../components/layout/AppLayout.jsx'

const BushDivers = ({ hubs, fleet, finances }) => {
  const [hubMapIsVisible, setHubMapIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useRemember({
    idx: usePage().url.search('page=') == -1 ? 0 : 2,
  })

  return (
    <Tabs
      defaultIndex={activeTab.idx}
      onChange={(idx) => {
        setHubMapIsVisible(idx == 1)
        setActiveTab({ idx })
      }}
    >
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
              <HubMap hubs={hubs} onIsVisible={hubMapIsVisible} />
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
