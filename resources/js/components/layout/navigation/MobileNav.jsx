import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from '@chakra-ui/react'
import React from 'react'

import NavMenuItems from '../navigation/sidebar/NavMenuItems'

const MobileNav = ({ isOpen, onClose }) => {
  return (
    <Drawer size="full" isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody mt={6}>
          <NavMenuItems />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default MobileNav
