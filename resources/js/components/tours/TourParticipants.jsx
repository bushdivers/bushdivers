import { Box, Card, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { BadgeCheck } from 'lucide-react'
import React from 'react'

import TourProgress from './TourProgress.jsx'

const TourParticipants = ({ tour }) => {
  return (
    <Box>
      <Heading size="md">
        Tour Participants ({tour.participants?.length})
      </Heading>
      <Box overflowY="auto" maxHeight="400px" px={2} mt={2}>
        {tour.participants?.length === 0 ? (
          <Text>No participants yet</Text>
        ) : (
          tour.participants?.map((p) => (
            <Card my={1} p={2} key={p.id}>
              <Flex justifyContent="space-between" alignItems="center" gap={2}>
                <Box>
                  {p.user.pilot_id} {p.user.private_name}
                </Box>
                <Box>{p.next_airport.identifier}</Box>
                <TourProgress progress={p.progress} />
                {p.is_completed ? (
                  <Icon color="green.500" as={BadgeCheck} />
                ) : null}
              </Flex>
            </Card>
          ))
        )}
      </Box>
    </Box>
  )
}

export default TourParticipants
