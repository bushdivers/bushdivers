import {
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
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
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import axios from 'axios'
import { Anchor, Package } from 'lucide-react'
import React, { useState } from 'react'
import showdown from 'showdown'

import BulkUploadModal from '../../components/elements/BulkUploadModal.jsx'
import BulkUploadResults from '../../components/elements/BulkUploadResults.jsx'
import AdminLayout from '../../components/layout/AdminLayout.jsx'

const MissionDetails = ({ mission, jobs, bulkUploadResults }) => {
  const [newJobError, setNewJobError] = useState(null)
  const [missionDetails, setMissionDetails] = useState({
    name: mission.name,
    description: mission.description,
    allow_private: mission.allow_private,
  })
  const [jobDetails, setJobDetails] = useState({
    departure: '',
    destination: '',
    cargo_type: '',
    cargo: '',
    qty: 0,
    recurring: '0',
    inject_immediately: false,
  })

  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isBulkUploadOpen,
    onOpen: onBulkUploadOpen,
    onClose: onBulkUploadClose,
  } = useDisclosure()

  function handleMissionChange(e) {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value

    setMissionDetails({
      ...missionDetails,
      [e.target.id]: value,
    })
  }

  function handleJobChange(e) {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value

    setJobDetails({
      ...jobDetails,
      [e.target.id]: value,
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
      inject_immediately: false,
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
      `/api/airport/search/${jobDetails.departure}?base=1`
    )
    const arrAirportResponse = await axios.get(
      `/api/airport/search/${jobDetails.destination}?base=1`
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

  function toggleJobRecurring(jobId) {
    router.post(`/admin/missions/jobs/${jobId}/toggle-recurring`)
  }

  function injectJobToContracts(jobId) {
    if (
      confirm(
        'Are you sure you want to dispatch a copy this job into the contracts list?'
      )
    ) {
      router.post(`/admin/missions/jobs/${jobId}/inject`)
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
              <FormControl mt={3}>
                <Checkbox
                  id="allow_private"
                  isChecked={missionDetails.allow_private}
                  onChange={handleMissionChange}
                >
                  Allow Private Aircraft
                </Checkbox>
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
            {!mission.is_completed && (
              <Flex gap={2}>
                <Button onClick={onBulkUploadOpen} size="sm" variant="outline">
                  Bulk Upload
                </Button>
                <Button onClick={onOpen} size="sm">
                  Add Job
                </Button>
              </Flex>
            )}
          </Flex>

          <BulkUploadResults
            results={bulkUploadResults}
            title="Bulk Upload Results"
            successMessage="job(s) successfully created and added to the mission"
          />

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
                      <Td>
                        {job.departure_airport.identifier}
                        {job.departure_airport.longest_runway_surface ===
                          'W' && <Icon as={Anchor} color="blue.500" />}
                        {job.departure_airport.is_thirdparty && (
                          <Icon as={Package} color="green.500" />
                        )}
                      </Td>
                      <Td>
                        {job.arrival_airport.identifier}
                        {job.arrival_airport.longest_runway_surface === 'W' && (
                          <Icon as={Anchor} color="blue.500" />
                        )}

                        {job.arrival_airport.is_thirdparty && (
                          <Icon as={Package} color="green.500" />
                        )}
                      </Td>
                      <Td>
                        {job.cargo_type === 1
                          ? `${job.cargo} ${job.payload} lbs`
                          : `${job.pax} ${job.cargo}`}
                      </Td>
                      <Td>
                        <Flex alignItems="center" gap={2}>
                          {job.is_recurring ? 'Yes' : 'No'}
                          <Button
                            size="xs"
                            colorScheme={job.is_recurring ? 'red' : 'green'}
                            onClick={() => toggleJobRecurring(job.id)}
                          >
                            {job.is_recurring ? 'Disable' : 'Enable'}
                          </Button>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex gap={2}>
                          {!mission.is_published && (
                            <Button
                              colorScheme="gray"
                              onClick={() => deleteJob(job.id)}
                              size="xs"
                            >
                              Remove
                            </Button>
                          )}
                          {mission.is_published && !mission.is_completed && (
                            <Button
                              onClick={() => injectJobToContracts(job.id)}
                              size="xs"
                            >
                              Create contract
                            </Button>
                          )}
                        </Flex>
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
              <Input onChange={handleJobChange} id="qty" type="number" />
            </FormControl>
            <FormControl>
              <FormLabel>Recurs Daily?</FormLabel>
              <Select onChange={handleJobChange} id="recurring">
                <option value="0">No</option>
                <option value="1">Yes</option>
              </Select>
            </FormControl>
            {mission.is_published && (
              <FormControl mt={3}>
                <Checkbox
                  id="inject_immediately"
                  isChecked={jobDetails.inject_immediately}
                  onChange={handleJobChange}
                >
                  Immediately create new contract for this job
                </Checkbox>
              </FormControl>
            )}
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

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={onBulkUploadClose}
        title="Bulk Upload Jobs"
        uploadUrl={`/admin/missions/${mission.id}/jobs/bulk-upload`}
        formatDescription={
          <VStack align="start">
            <Text>Upload a CSV file with the following columns:</Text>
            <Text fontFamily="monospace">
              departure_icao, arrival_icao, cargo_type, cargo, qty, is_recurring
            </Text>
            <Text fontSize="xs">cargo_type: 1=payload, 2=passengers</Text>
          </VStack>
        }
        additionalFields={
          mission.is_published
            ? (data, updateData, isUploading) => (
                <FormControl mt={3}>
                  <Checkbox
                    isChecked={data.inject_immediately || false}
                    onChange={(e) =>
                      updateData('inject_immediately', e.target.checked)
                    }
                    disabled={isUploading}
                  >
                    Immediately create contracts for uploaded jobs
                  </Checkbox>
                </FormControl>
              )
            : null
        }
      />
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
