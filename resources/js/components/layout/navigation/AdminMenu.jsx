import { Box, Card, CardBody, Link as ChakraLink, Flex } from '@chakra-ui/react'
import { Link as InertiaLink } from '@inertiajs/react'
import { usePage } from '@inertiajs/react'
import React from 'react'

import { doesUserHaveRole } from '../../../helpers/auth.helpers.js'

const AdminMenu = () => {
  const { auth } = usePage().props
  return (
    <Box>
      <Card>
        <CardBody>
          <Flex direction="column">
            <ChakraLink as={InertiaLink} href="/admin/fleet">
              Fleet
            </ChakraLink>
            {doesUserHaveRole(auth.user.user_roles, 'tour_admin') && (
              <ChakraLink as={InertiaLink} href="/admin/tours">
                Tours
              </ChakraLink>
            )}
            {doesUserHaveRole(auth.user.user_roles, 'tour_admin') && (
              <ChakraLink as={InertiaLink} href="/admin/missions">
                Missions
              </ChakraLink>
            )}
            {!!auth.user.is_admin && (
              <ChakraLink as={InertiaLink} href="/admin/users">
                Users
              </ChakraLink>
            )}
            {!!auth.user.is_admin && (
              <ChakraLink as={InertiaLink} href="/admin/pireps">
                Pireps
              </ChakraLink>
            )}
            {!!auth.user.is_admin && (
              <ChakraLink as={InertiaLink} href="/admin/hubs">
                Hubs
              </ChakraLink>
            )}
          </Flex>
        </CardBody>
      </Card>
    </Box>
  )
}

export default AdminMenu
