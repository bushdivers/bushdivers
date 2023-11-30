import React from 'react'
import { ListItem, Tooltip, IconButton } from '@chakra-ui/react'
import { Link, usePage } from '@inertiajs/inertia-react'

const SideNavItem = ({ index, item }) => {
  const { url } = usePage()
  return (
    <ListItem key={index}>
      <Tooltip label={item.label} placement="right">
        <IconButton
          isActive={url === item.to}
          key={index}
          as={Link}
          aria-label={item.label}
          borderRadius="xl"
          icon={item.icon}
          to={item.to}
        />
      </Tooltip>
    </ListItem>
  )
}

export default SideNavItem
