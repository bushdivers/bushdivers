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
  Image,
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
          </AlertDescription>
        </Box>
      </Alert>
      <SimpleGrid mt={2} columns={3} gap={4}>
        {tours.map((tour) => (
          <Link key={tour.id} href={`/tours/${tour.id}`}>
            <Card>
              <CardBody>
                <Flex direction="column" alignItems="center">
                  <Image src={tour.image} h="200px" objectFit="cover" />
                  <Heading size="md">{tour.title}</Heading>
                  <Flex>
                    <Text>No. of Checkpoints:</Text>
                    <Text ml={2}>{tour.checkpoints.length}</Text>
                  </Flex>
                  {tour.participants.find((p) => p.user_id === auth.user.id) ? (
                    <Icon color="green.500" boxSize={10} as={BadgeCheck} />
                  ) : null}
                </Flex>
              </CardBody>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  )
}

Tours.layout = (page) => (
  <AppLayout children={page} title="Tours" heading="Tours" />
)
export default Tours
