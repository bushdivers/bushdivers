import { Box, Card, Flex, Heading, Icon, Tag } from '@chakra-ui/react'
import { BadgeCheck } from 'lucide-react'
import React from 'react'

import TourProgress from './TourProgress.jsx'

const TourCheckpoints = ({
  isUserParticipant,
  userProgress,
  checkpoints,
  userCheckpoints,
}) => {
  return (
    <Box>
      <Flex justifyContent="space-between">
        <Heading size="md">Tour Checkpoints ({checkpoints.length})</Heading>
        {isUserParticipant ? <TourProgress progress={userProgress} /> : null}
      </Flex>

      <Box overflowY="auto" maxHeight="400px" px={2} mt={2}>
        {isUserParticipant ? (
          <>
            {userCheckpoints.map((c) => (
              <Card my={1} p={2} key={c.id}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Box>
                    <Tag>{c.section}</Tag> {c.airport.identifier}{' '}
                    {c.airport.name}
                  </Box>
                  <Box>
                    {c.is_completed ? (
                      <Icon color="green.500" as={BadgeCheck} />
                    ) : null}
                  </Box>
                </Flex>
              </Card>
            ))}
          </>
        ) : (
          <>
            {checkpoints.map((c) => (
              <Card my={1} p={2} key={c.id}>
                <Flex alignItems="center" gap={2}>
                  <Box py={1} px={2} rounded="md" bgColor="gray.200">
                    {c.section}
                  </Box>{' '}
                  {c.airport.identifier} {c.airport.name}
                </Flex>
              </Card>
            ))}
          </>
        )}
      </Box>
    </Box>
  )
}

export default TourCheckpoints
