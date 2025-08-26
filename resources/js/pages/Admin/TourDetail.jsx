import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  SimpleGrid,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import { Trash } from 'lucide-react'
import React, { useState } from 'react'

import TourAddCheckpointModal from '../../components/admin/TourAddCheckpointModal.jsx'
import TourAddFleetModal from '../../components/admin/TourAddFleetModal.jsx'
import AdminLayout from '../../components/layout/AdminLayout.jsx'

const TourDetail = ({ tour, fleet }) => {
  const {
    isOpen: isFleetOpen,
    onOpen: onFleetOpen,
    onClose: onFleetClose,
  } = useDisclosure()
  const {
    isOpen: isCheckpointOpen,
    onOpen: onCheckpointOpen,
    onClose: onCheckpointClose,
  } = useDisclosure()
  const [tourDetails, setTourDetails] = useState({
    title: tour.title,
    description: tour.description,
    start: tour.start_airport_id,
  })

  function handleTourChange(e) {
    setTourDetails({
      ...tourDetails,
      [e.target.id]: e.target.value,
    })
  }

  function saveTour() {
    router.post(`/admin/tours/${tour.id}`, tourDetails)
  }

  function publishTour() {
    if (confirm('Are you sure you want to publish this tour?')) {
      router.post(`/admin/tours/${tour.id}/publish`)
    }
  }

  function removeItem(itemType, id) {
    if (itemType === 'fleet') {
      router.delete(`/admin/tours/${tour.id}/fleet/${id}`)
    }
  }

  return (
    <>
      <Box>
        <Card>
          <CardBody>
            {!tour.is_published && (
              <Button onClick={() => publishTour()} colorScheme="gray">
                Publish
              </Button>
            )}

            <SimpleGrid columns={2} gap={4}>
              <Box p={2}>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={tourDetails.title}
                    onChange={handleTourChange}
                    id="title"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={tourDetails.description}
                    onChange={handleTourChange}
                    id="description"
                  />
                </FormControl>
                <FormControl isDisabled={tour.is_published}>
                  <FormLabel>Start Airport (ICAO)</FormLabel>
                  <Input
                    value={tourDetails.start}
                    onChange={handleTourChange}
                    id="start"
                  />
                </FormControl>
                <Flex mt={2} justifyContent="end">
                  <Button size="sm" onClick={() => saveTour()}>
                    Save
                  </Button>
                </Flex>
                <Box mt={6}>
                  <Flex justifyContent="space-between">
                    <Heading size="md">
                      Valid Aircraft ({tour.aircraft.length})
                    </Heading>
                    <Button onClick={onFleetOpen} size="sm" colorScheme="gray">
                      Add
                    </Button>
                  </Flex>
                  <Box mt={2} overflowY="auto" maxHeight="400px" px={2}>
                    {tour.aircraft.map((ac) => (
                      <Card my={1} p={2} key={ac.id}>
                        <Flex
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Text>
                            {ac.fleet.manufacturer} {ac.fleet.name}
                          </Text>
                          <Button
                            onClick={() => removeItem('fleet', ac.fleet.id)}
                            colorScheme="gray"
                            size="xs"
                          >
                            <Icon as={Trash} />
                          </Button>
                        </Flex>
                      </Card>
                    ))}
                  </Box>
                </Box>
              </Box>
              <Box p={2}>
                <Flex justifyContent="space-between">
                  <Heading size="md">
                    Checkpoints ({tour.checkpoints?.length})
                  </Heading>
                  {!tour.is_published && (
                    <Button
                      onClick={onCheckpointOpen}
                      size="sm"
                      colorScheme="gray"
                    >
                      Add
                    </Button>
                  )}
                </Flex>
                <Box overflowY="auto" maxHeight="800px" px={2}>
                  {tour.checkpoints?.map((c) => (
                    <Card my={1} p={2} key={c.id}>
                      <Flex
                        alignItems="center"
                        justifyContent="space-between"
                        gap={2}
                      >
                        <Box py={1} px={2} rounded="md" bgColor="gray.200">
                          {c.section}
                        </Box>{' '}
                        {c.checkpoint} {c.airport.name}
                      </Flex>
                    </Card>
                  ))}
                </Box>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
      </Box>
      <TourAddFleetModal
        fleet={fleet}
        isOpen={isFleetOpen}
        onClose={onFleetClose}
        tourId={tour.id}
      />
      <TourAddCheckpointModal
        fleet={fleet}
        isOpen={isCheckpointOpen}
        onClose={onCheckpointClose}
        tourId={tour.id}
      />
    </>
  )
}
TourDetail.layout = (page) => (
  <AdminLayout
    children={page}
    heading="Tour Management"
    subHeading="Edit Tour Details"
  />
)
export default TourDetail
