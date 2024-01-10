import { Box, Divider } from '@chakra-ui/react'
import {
  GanttChartSquare,
  Globe2,
  HelpCircle,
  NotebookText,
} from 'lucide-react'
import React from 'react'

import NavItem from './NavItem.jsx'

const NavMenuItems = () => {
  return (
    <Box>
      <Box my={4}>
        <NavItem icon={NotebookText} text="My Logbook" to="/logbook" />
        <NavItem icon={Globe2} text="Live Map" to="/live-map" />
        <NavItem
          icon={GanttChartSquare}
          text="Flight Dispatch"
          to="/dispatch"
        />
      </Box>
      <Divider mt={4} />
      <Box my={4}>
        <NavItem icon={HelpCircle} text="Help" to="/live-map" />
      </Box>
    </Box>
  )
}

export default NavMenuItems
