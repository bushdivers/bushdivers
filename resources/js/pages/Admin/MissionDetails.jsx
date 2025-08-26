import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import axios from 'axios'
import React, { useState } from 'react'
import showdown from 'showdown'

import AdminLayout from '../../components/layout/AdminLayout.jsx'

const MissionDetails = ({ mission, jobs }) => {
  const [newJobError, setNewJobError] = useState(null)
  const [missionDetails, setMissionDetails] = useState({
    name: mission.name,
    description: mission.description,
  })
  const [jobDetails, setJobDetails] = useState({
    departure: '',
    destination: '',
    cargo_type: '',
    cargo: '',
    qty: 0,
    recurring: '0',
  })

  const { isOpen, onOpen, onClose } = useDisclosure()

  function handleMissionChange(e) {
    setMissionDetails({
      ...missionDetails,
      [e.target.id]: e.target.value,
    })
  }

  function handleJobChange(e) {
    setJobDetails({
      ...jobDetails,
      [e.target.id]: e.target.value,
    })
  }

  async function saveMission() {
    if (missionDetails.name === '' || missionDetails.description === '') {
      alert('Please ensure all fields are filled in')
      return
    }
    const converter = new showdown.Converter()
    missionDetails.description = await converter.makeHtml(
      missionDetails.description
    )
    router.post(`/admin/missions/${mission.id}`, missionDetails)
  }
  function publishMission() {
    if (confirm('Are you sure you want to publish this tour?')) {
      router.post(`/admin/missions/${mission.id}/publish`)
    }
  }

  function clearForm() {
    setJobDetails({
      departure: '',
      destination: '',
      cargo_type: '',
      cargo: '',
      qty: 0,
      recurring: '0',
    })
    setNewJobError(null)
    onClose()
  }

  function deleteJob(id) {
    if (confirm('Are you sure you want to remove this Job?')) {
      router.delete(`/admin/missions/jobs/${id}`)
    }
  }

  async function addJob() {
    setNewJobError('')
    if (
      jobDetails.departure === '' ||
      jobDetails.destination === '' ||
      jobDetails.cargo === '' ||
      jobDetails.cargo_type === '' ||
      jobDetails.qty === 0 ||
      jobDetails.qty === ''
    ) {
      setNewJobError('Please ensure all fields are filled in')
      return
    }

    const depAirportResponse = await axios.get(
      `/api/airport/search/${jobDetails.departure}`
    )
    const arrAirportResponse = await axios.get(
      `/api/airport/search/${jobDetails.destination}`
    )

    if (!depAirportResponse.data.airport) {
      setNewJobError('Departure airport not found')
      return
    }

    if (!arrAirportResponse.data.airport) {
      setNewJobError('Destination airport not found')
      return
    }

    router.post(`/admin/missions/${mission.id}/jobs`, jobDetails)
    clearForm()
  }

  function completeMission() {
    if (confirm('Are you sure you want to complete this mission?')) {
      router.post(`/admin/missions/${mission.id}/complete`)
    }
  }

  return (
    <>
      <Card>
        <CardBody>
          {!mission.is_published && (
            <Button onClick={() => publishMission()} colorScheme="gray">
              Publish
            </Button>
          )}
          {mission.is_published && (
            <Button onClick={() => completeMission()} colorScheme="gray">
              Complete
            </Button>
          )}
          <SimpleGrid columns={2} gap={4}>
            <Box p={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  value={missionDetails.name}
                  onChange={handleMissionChange}
                  id="name"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={missionDetails.description}
                  onChange={handleMissionChange}
                  id="description"
                />
              </FormControl>
              <Flex mt={2} justifyContent="end">
                <Button size="sm" onClick={() => saveMission()}>
                  Save
                </Button>
              </Flex>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>
      <Card mt={2}>
        <CardBody>
          <Flex justifyContent="space-between">
            <Heading size="md">Jobs</Heading>
            {!mission.is_published && (
              <Button onClick={onOpen} size="sm">
                Add Job
              </Button>
            )}
          </Flex>
          {jobs?.length > 0 ? (
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Departure</Th>
                    <Th>Destination</Th>
                    <Th>Cargo</Th>
                    <Th>Recurs Daily</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {jobs.map((job) => (
                    <Tr key={job.id}>
                      <Td>{job.dep_airport_id}</Td>
                      <Td>{job.arr_airport_id}</Td>
                      <Td>
                        {job.cargo_type === 1
                          ? `${job.cargo} ${job.payload} lbs`
                          : `${job.pax} ${job.cargo}`}
                      </Td>
                      <Td>{job.is_recurring ? 'Yes' : 'No'}</Td>
                      <Td>
                        {!mission.is_published && (
                          <Button
                            colorScheme="gray"
                            onClick={() => deleteJob(job.id)}
                            size="xs"
                          >
                            Remove
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Heading size="sm">No Jobs</Heading>
          )}
        </CardBody>
      </Card>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={() => {
          clearForm()
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Job</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {newJobError ? <Text color="red.500">{newJobError}</Text> : null}
            <FormControl>
              <FormLabel>Departure ICAO</FormLabel>
              <Input onChange={handleJobChange} id="departure" />
            </FormControl>
            <FormControl>
              <FormLabel>Arrival ICAO</FormLabel>
              <Input onChange={handleJobChange} id="destination" />
            </FormControl>
            <FormControl>
              <FormLabel>Cargo Type</FormLabel>
              <Select
                onChange={handleJobChange}
                id="cargo_type"
                placeholder="Select option"
              >
                <option value="1">Cargo</option>
                <option value="2">Passengers</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Cargo Text</FormLabel>
              <Input onChange={handleJobChange} id="cargo" />
            </FormControl>
            <FormControl>
              <FormLabel>Cargo Qty</FormLabel>
              <Input onChange={handleJobChange} id="qty" />
            </FormControl>
            <FormControl>
              <FormLabel>Recurs Daily?</FormLabel>
              <Select onChange={handleJobChange} id="recurring">
                <option value="0">No</option>
                <option value="1">Yes</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => addJob()} mr={3}>
              Save
            </Button>
            <Button
              colorScheme="gray"
              onClick={() => {
                clearForm()
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

MissionDetails.layout = (page) => (
  <AdminLayout
    children={page}
    heading="Mission Management"
    subHeading="Mission Details"
  />
)

export default MissionDetails
