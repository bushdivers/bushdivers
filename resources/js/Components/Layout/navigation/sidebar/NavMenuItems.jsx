import { Box, Divider } from '@chakra-ui/react'
import { usePage } from '@inertiajs/react'
import {
  AreaChart,
  Building,
  CircleDollarSign,
  Download,
  FileSearch,
  GanttChartSquare,
  Globe2,
  HelpCircle,
  NotebookText,
  Plane,
} from 'lucide-react'
import React from 'react'

import NavItem from './NavItem.jsx'

const NavMenuItems = () => {
  const { auth } = usePage().props
  return (
    <Box>
      <Box my={4}>
        <NavItem icon={NotebookText} text="My Logbook" to="/dashboard" />
        <NavItem icon={Globe2} text="Live Map" to="/live-flights" />
        <NavItem
          icon={GanttChartSquare}
          text="Flight Dispatch"
          to="/dispatch"
        />
        <NavItem
          icon={FileSearch}
          text="Find Contracts"
          to={`/airports/${auth.user.current_airport_id}`}
        />
        <NavItem icon={Plane} text="My Aircraft" to="/my-aircraft" />
        <NavItem icon={CircleDollarSign} text="Finances" to="/finances" />
        <NavItem icon={Building} text="Bush Divers HQ" to="/live-map" />
        <NavItem icon={AreaChart} text="Stats" to="/live-map" />
      </Box>
      <Divider mt={4} />
      <Box my={4}>
        <NavItem icon={HelpCircle} text="Help" to="/live-map" />
        <NavItem icon={Download} text="Bush Tracker" to="/live-map" />
      </Box>
    </Box>
  )
}

export default NavMenuItems
