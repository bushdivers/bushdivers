import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import { Link, usePage } from '@inertiajs/react'
import { BadgeCheck } from 'lucide-react'
import React from 'react'

import AppLayout from '../../components/layout/AppLayout.jsx'

const Tours = ({ tours }) => {
  const { auth } = usePage().props
  return (
    <Box>
      <Alert status="info">
        <AlertIcon />
        <Box>
          <AlertTitle>Info!</AlertTitle>
          <AlertDescription>
            <Text fontSize="sm">
              Sign up for tours and track your progress. Each tour has a set
              number of checkpoints that you must hit in order to complete the
              tour.
            </Text>
            <Text fontSize="sm">
              The route you take to a checkpoint is entirely up to you. And can
              be in as many, or as few, flights as you wish.
            </Text>
            <Text fontSize="sm">
              Each tour has specific aircraft types that you are allowed to
              choose from.
            </Text>
            <Text fontSize="sm">
              You will not be able to use Bush Divers fleet aircraft on tour
              flights. During dispatch, you will need to specify if it is a tour
              flight. This is important in order to track progress.
            </Text>
            <Text fontSize="sm">
              Pay attention to fuel!! you will need to plan when you need to
              carry it with you or you might get stranded.
            </Text>
          </AlertDescription>
        </Box>
      </Alert>
      {tours?.length > 0 ? (
        <SimpleGrid mt={2} columns={3} gap={4}>
          {tours.map((tour) => (
            <>
              {tour.is_published ? (
                <Link key={tour.id} href={`/tours/${tour.id}`}>
                  <Card>
                    <CardBody>
                      <Flex direction="column" alignItems="center">
                        <Heading size="md">{tour.title}</Heading>
                        <Flex>
                          <Text>No. of Checkpoints:</Text>
                          <Text ml={2}>{tour.checkpoints.length}</Text>
                        </Flex>
                        {tour.participants.find(
                          (p) => p.user_id === auth.user.id && p.is_completed
                        ) ? (
                          <Icon
                            color="green.500"
                            boxSize={10}
                            as={BadgeCheck}
                          />
                        ) : null}
                      </Flex>
                    </CardBody>
                  </Card>
                </Link>
              ) : null}
            </>
          ))}
        </SimpleGrid>
      ) : (
        <Card mt={4}>
          <CardBody>
            <Flex justifyItems="center">
              <Heading size="md">
                There are currently no tours available
              </Heading>
            </Flex>
          </CardBody>
        </Card>
      )}
    </Box>
  )
}

Tours.layout = (page) => (
  <AppLayout children={page} title="Tours" heading="Tours" />
)
export default Tours
