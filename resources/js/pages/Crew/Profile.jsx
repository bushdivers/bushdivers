import {
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { Link, router, usePage } from '@inertiajs/react'
import { CheckCircle2 } from 'lucide-react'
import React, { useState } from 'react'

import ApiKey from '../../components/crew/ApiKey'
import AppLayout from '../../components/layout/AppLayout'
import { convertMinuteDecimalToHoursAndMinutes } from '../../helpers/date.helpers'

const Profile = ({ profile, rank, nextRank, awards }) => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    email: profile.email,
    password: '',
    name: profile.name,
    opt_in: profile.opt_in,
    allow_thirdparty_airport: profile.allow_thirdparty_airport || false,
    allow_campsite_airport: profile.allow_campsite_airport || false,
    msfs_username: profile.msfs_username || '',
    volanta_username: profile.volanta_username || '',
    discord_username: profile.discord_username || '',
  })

  function handleChange(e) {
    const key = e.target.id
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues((values) => ({
      ...values,
      [key]: value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    router.put('/profile', values)
  }

  function handleResetCareer() {
    if (
      window.confirm(
        'Are you sure you want to reset your career, this will clear your finance history and any owned aircraft?'
      )
    ) {
      router.post('/profile/reset')
    }
  }

  return (
    <Tabs>
      <TabList>
        <Tab>Profile Details</Tab>
        <Tab>Rank Progress</Tab>
        <Tab>Awards</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Card>
            <CardBody>
              <Flex justifyContent="space-between">
                <ApiKey apiKey={profile.api_token} />
                <Button
                  onClick={() => handleResetCareer()}
                  size="sm"
                  colorScheme="gray"
                >
                  Reset Career
                </Button>
              </Flex>
              <Heading my={2} size="md">
                Edit Profile
              </Heading>
              <form onSubmit={handleSubmit}>
                <FormControl isInvalid={errors?.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    id="email"
                    value={values.email}
                    type="email"
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors?.email}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors?.name}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    id="name"
                    value={values.name}
                    type="text"
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors?.name}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors?.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    id="password"
                    value={values.password}
                    type="password"
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors?.password}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors?.msfs_username}>
                  <FormLabel>MSFS Username</FormLabel>
                  <Input
                    id="msfs_username"
                    value={values.msfs_username}
                    type="text"
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors?.msfs_username}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors?.volanta_username}>
                  <FormLabel>Volanta Username</FormLabel>
                  <Input
                    id="volanta_username"
                    value={values.volanta_username}
                    type="text"
                    onChange={handleChange}
                  />
                  <FormErrorMessage>
                    {errors?.volanta_username}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors?.discord_username}>
                  <FormLabel>Discord Username</FormLabel>
                  <Input
                    id="discord_username"
                    value={values.discord_username}
                    type="text"
                    onChange={handleChange}
                  />
                  <FormErrorMessage>
                    {errors?.discord_username}
                  </FormErrorMessage>
                </FormControl>

                <Box mt={4}>
                  <Heading size="sm" mb={3}>
                    Flight Options
                  </Heading>

                  <FormControl isInvalid={errors?.allow_thirdparty_airport}>
                    <Checkbox
                      id="allow_thirdparty_airport"
                      isChecked={values.allow_thirdparty_airport}
                      onChange={handleChange}
                    >
                      Allow Third-Party Airports
                    </Checkbox>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Enable destinations not included in the base simulator.
                      Requires additional scenery mods to be installed.
                      <br />
                      <Text as="span" fontWeight="semibold">
                        {' '}
                        Note:
                      </Text>{' '}
                      Company fleet aircraft are restricted to base-game
                      airports only.
                    </Text>
                    <FormErrorMessage>
                      {errors?.allow_thirdparty_airport}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={errors?.allow_campsite_airport}
                    mt={3}
                  >
                    <Checkbox
                      id="allow_campsite_airport"
                      isChecked={values.allow_campsite_airport}
                      onChange={handleChange}
                    >
                      Allow Campsite Landings
                    </Checkbox>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Permit landings at remote bush strips, campsites, and
                      other unofficial locations for true backcountry flying.
                      <br />
                      <Text as="span" fontWeight="semibold">
                        {' '}
                        Note:
                      </Text>{' '}
                      Only one campsite can exist at a time. Creating a new
                      campsite will remove the previous one and return any
                      aircraft there to their last known airport.
                      <br />
                      <Text as="span" fontWeight="semibold">
                        {' '}
                        Note:
                      </Text>{' '}
                      Company fleet aircraft are restricted to base-game
                      airports only.
                    </Text>
                    <FormErrorMessage>
                      {errors?.allow_campsite_airport}
                    </FormErrorMessage>
                  </FormControl>
                </Box>

                <Flex mt={2} justifyContent="end">
                  <Button type="submit">Update profile</Button>
                </Flex>
              </form>
            </CardBody>
          </Card>
        </TabPanel>
        <TabPanel>
          <Card>
            <CardBody>
              {!nextRank ? (
                <Box>
                  Congratulations, {rank.name}.<br />
                  You have achieved the highest rank.
                </Box>
              ) : (
                <Box>
                  <Heading size="sm">Next Rank:</Heading>
                  <Flex alignItems="center" gap={4}>
                    <Flex alignItems="center">
                      <img width="60" src={nextRank.image} />{' '}
                      <Text fontSize="sm" ml={2}>
                        {nextRank.name}
                      </Text>
                    </Flex>
                    <Flex alignItems="center">
                      <Box mr={2}>
                        Hours:{' '}
                        {profile.flights_time >= nextRank.hours * 60 ? (
                          <Icon color="green.500" as={CheckCircle2} />
                        ) : (
                          <Box>
                            {convertMinuteDecimalToHoursAndMinutes(
                              nextRank.hours * 60 - profile.flights_time
                            )}
                          </Box>
                        )}
                        <br />
                        Points:{' '}
                        {profile.points >= nextRank.points ? (
                          <Icon color="green.500" as={CheckCircle2} />
                        ) : (
                          <Box>{nextRank.points - profile.points}</Box>
                        )}
                      </Box>
                    </Flex>
                  </Flex>
                </Box>
              )}
            </CardBody>
          </Card>
        </TabPanel>
        <TabPanel>
          <Card>
            <CardBody>
              {!awards.length ? (
                <div className="mt-1 text-sm text-center">
                  No awards yet. <Link href="/ranks#awards">Earn some!</Link>
                </div>
              ) : (
                <SimpleGrid columns={5} gap={5}>
                  {awards &&
                    awards.map((award) => (
                      <Flex
                        direction="column"
                        alignItems="center"
                        gap={1}
                        key={award.id}
                      >
                        <img height="100" width="100" src={award.image} />
                        <Box mt={1}>
                          <Text fontSize="sm">{award.name}</Text>
                        </Box>
                      </Flex>
                    ))}
                </SimpleGrid>
              )}
            </CardBody>
          </Card>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

Profile.layout = (page) => (
  <AppLayout children={page} title="Profile" heading="Profile" />
)

export default Profile
