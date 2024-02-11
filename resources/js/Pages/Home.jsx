import {
  Box,
  Flex,
  Heading,
  Image,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react'
import { Head, router, usePage } from '@inertiajs/react'
import React, { useEffect } from 'react'

import Footer from '../components/layout/navigation/public/Footer'
import NavBar from '../components/layout/navigation/public/NavBar'

const Home = ({ stats }) => {
  const { auth } = usePage().props

  useEffect(() => {
    if (auth.user) router.get('/dashboard')
  })

  return (
    <Flex direction="column">
      <Head title="Bush Divers Virtual Airline" />
      <NavBar />
      <Box mt={20}>
        <Flex alignItems="center" direction="column">
          <Image
            blockSize={28}
            src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png"
            alt="Workflow"
          />
          <Box textAlign="center">
            <Heading size="2xl" my={4}>
              Welcome to Bush Divers VA
            </Heading>
            <Heading size="sm">
              Bush flying in and around Papua New Guinea and Alaska
            </Heading>
          </Box>
        </Flex>
      </Box>
      <Box textAlign="center" mt={8}>
        <Flex alignItems="center" justifyContent="center" my={6}>
          <Stat>
            <StatLabel>Total Flight</StatLabel>
            <StatNumber>{stats?.flights}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Total Pilots</StatLabel>
            <StatNumber>{stats?.pilots}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Total Regions</StatLabel>
            <StatNumber>3</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Total Hubs</StatLabel>
            <StatNumber>{stats?.hubs}</StatNumber>
          </Stat>
        </Flex>
      </Box>
      <Box style={{ backgroundImage: 'url(img/bg-2.jpg)' }}>
        <Box
          color="white"
          px={72}
          py={20}
          style={{ background: 'rgba(0,0,0,0.51)' }}
        >
          <Heading mb={4} size="2xl">
            Our story
          </Heading>
          <Text fontSize="xl">
            We are a community of pilots focused on one thing, bush flying!
            Disregarding the ho-hum of big jets and long airfields we opt for
            the dangers of low and slow flying through rugged terrain and
            ever-changing weather landing at the most remote and inhospitable
            airfields in aviation history.
            <br />
            <br />
            Ponder this, will you? The weather is closing in. The intended
            landing strip is at 5364ft above sea level and clings to the side of
            a jungle covered mountain. Perhaps 1000ft long, this runway is the
            only connection the local people have with the outside world. You
            think you can see the end of the grass strip protruding from a bank
            of cloud. Do you commit? This is the daily decision making of a Bush
            Diver, landing our aircraft on dangerous and remote strips,
            surrounded by hazardous terrain and often with rapidly changing
            weather conditions and visibility. Bush Divers is a bush flying
            focused virtual airline with a strong community of fellow bush
            flying enthusiasts. To find out more about Bush Divers, head to our
            main{' '}
            <a
              className="text-white underline"
              href="https://www.bushdivers.com/"
              target="_blank"
              rel="noreferrer"
            >
              information site
            </a>
          </Text>
        </Box>
      </Box>
      <Footer />
    </Flex>
  )
}

export default Home
