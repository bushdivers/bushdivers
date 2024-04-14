import { Box, Divider } from '@chakra-ui/react'
import { usePage } from '@inertiajs/react'
import {
  AreaChart,
  Building,
  CircleDollarSign,
  Cog,
  Download,
  FileSearch,
  GanttChartSquare,
  Globe2,
  HelpCircle,
  NotebookText,
  Plane,
  Route,
} from 'lucide-react'
import React from 'react'

import { doesUserHaveRole } from '../../../../helpers/auth.helpers.js'
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
        <NavItem icon={Route} text="Tours" to="/tours" />
        <NavItem icon={Plane} text="My Aircraft" to="/my-aircraft" />
        <NavItem icon={CircleDollarSign} text="My Finances" to="/my-finances" />
        <NavItem icon={Building} text="Bush Divers HQ" to="/bushdivers-hq" />
        <NavItem icon={AreaChart} text="Stats (Coming Soon)" to="" />
      </Box>
      <Divider mt={4} />
      <Box my={4}>
        {auth.user.is_admin ||
        doesUserHaveRole(auth.user.user_roles, 'fleet_admin') ? (
          <NavItem icon={Cog} text="Admin" to="/admin/fleet" />
        ) : (
          <></>
        )}
        <NavItem
          icon={HelpCircle}
          text="Help (Docs)"
          to="https://bush-divers-1.gitbook.io/bush-divers/"
          isExternal
        />
        <NavItem
          isExternal
          icon={Download}
          text="Bush Tracker"
          to="https://bushdivers-resource.s3.amazonaws.com/bush-tracker/BushTracker.zip"
        />
      </Box>
    </Box>
  )
}

export default NavMenuItems
