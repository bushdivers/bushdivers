import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'

import AppLayout from '../../components/layout/AppLayout.jsx'
import TourCheckpoints from '../../components/tours/TourCheckpoints.jsx'
import TourMap from '../../components/tours/TourMap.jsx'
import TourParticipants from '../../components/tours/TourParticipants.jsx'

const TourDetails = ({ tour, checkpoints, userCheckpoints }) => {
  const [userProgress, setUserProgress] = useState(0)
  const [isUserParticipant, setIsUserParticipant] = useState(false)
  const { auth } = usePage().props

  useEffect(() => {
    const participant = tour.participants.some(
      (e) => e.user_id === auth.user.id
    )
    setIsUserParticipant(participant)
  }, [tour])

  useEffect(() => {
    const userTourData = tour.participants?.find(
      (p) => p.user_id === auth.user.id
    )
    if (userTourData) setUserProgress(userTourData.progress)
  }, [tour])

  function joinTour() {
    router.post(`/tours/${tour.id}/join`)
  }

  return (
    <Box>
      <Flex justifyContent="center">
        <Flex alignItems="center" gap={24}>
          <Image h="200px" src={tour.image} />
          <Card mt={2}>
            <CardBody>
              <Heading size="md">{tour.title}</Heading>
              <Text mt={2} width="90%">
                {tour.description}
              </Text>
            </CardBody>
            {isUserParticipant ? null : (
              <CardFooter>
                <Button onClick={() => joinTour()} size="sm" w="100%">
                  Sign Up
                </Button>
              </CardFooter>
            )}
          </Card>
          <Box>
            <Heading size="md">Valid Aircraft ({tour.aircraft.length})</Heading>
            <Box mt={2} overflowY="auto" maxHeight="100px" px={2}>
              {tour.aircraft.map((ac) => (
                <Card my={1} p={2} key={ac.id}>
                  <Text>
                    {ac.fleet.manufacturer} {ac.fleet.name}
                  </Text>
                </Card>
              ))}
            </Box>
          </Box>
        </Flex>
      </Flex>
      <Box p={4} mt={6}>
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          <GridItem colSpan={2}>
            <TourMap start={tour.starting_airport} checkpoints={checkpoints} />
          </GridItem>
          <GridItem colSpan={1}>
            <TourParticipants tour={tour} />
          </GridItem>
          <GridItem colSpan={1}>
            <TourCheckpoints
              checkpoints={checkpoints}
              userCheckpoints={userCheckpoints}
              userProgress={userProgress}
              isUserParticipant={isUserParticipant}
            />
          </GridItem>
        </Grid>
      </Box>
    </Box>
  )
}

TourDetails.layout = (page) => (
  <AppLayout children={page} title="Tour Details" heading="Tour Details" />
)

export default TourDetails
