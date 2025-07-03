import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Input,
  Select,
  Text,
} from '@chakra-ui/react'
import { usePage } from '@inertiajs/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

import ChatBubble from '../../components/elements/experimental/ChatBubble'
import ChatContainer from '../../components/elements/experimental/ChatContainer'
import DispatchDetails from '../../components/elements/experimental/DispatchDetails'
import TypeWriter from '../../components/elements/experimental/TypeWriter'
import TypingIndicator from '../../components/elements/experimental/TypingIndicator'
import AppLayout from '../../components/layout/AppLayout'
import { parseMarkdownJson } from '../../helpers/generic.helpers'

const ContractGenerator = () => {
  const [showParams, setShowParams] = useState(false)
  const [showAcceptance, setShowAcceptance] = useState(false)
  const [showUserAcceptance, setShowUserAcceptance] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [typing, setTyping] = useState(false)
  const { auth } = usePage().props
  const [paramsError, setParamsError] = useState(null)
  const [errorText, setErrorText] = useState(null)
  const [dispatchData, setDispatchData] = useState(null)
  const [dispatchParams, setdispatchParams] = useState({
    icaoDep: auth.user.current_airport_id,
    minSize: null,
    cargoType: null,
    maxCargo: null,
    maxDistance: null,
    aircraftSize: null,
  })

  useEffect(() => {
    setInterval(() => {
      setShowParams(true)
    }, 2)
  }, [])

  const handleChange = (e) => {
    setdispatchParams({
      ...dispatchParams,
      [e.target.id]: e.target.value,
    })
  }

  const submitDispatchRequest = async () => {
    setParamsError(null)
    if (
      dispatchParams.cargoType === null ||
      dispatchParams.icaoDep === null ||
      dispatchParams.maxCargo === null ||
      dispatchParams.maxDistance === null
    ) {
      setParamsError('Please ensure all fields are set')
    } else {
      setTyping(true)
      try {
        const response = await axios.post(
          `/api/contracts/experimental`,
          dispatchParams
        )
        if (response.status === 200) {
          let md = response.data.contract.candidates[0].content.parts[0].text
          const jsonData = parseMarkdownJson(md)
          setDispatchData({
            contract: jsonData,
            departureAirport: response.data.departure,
            destinationAirport: response.data.destination,
          })
          setInterval(() => {
            setShowAcceptance(true)
          }, 3000)
        }
      } catch (e) {
        setErrorText('We seem to have run into a problem.')
      }
      setTyping(false)
    }
  }

  const submitAcceptance = (status) => {
    if (status === false) {
      location.reload()
    } else {
      setShowUserAcceptance(true)
      setTyping(true)
      setInterval(() => {
        setTyping(false)
        setShowBooking(true)
      }, 1000)
      setInterval(() => {
        setTyping(false)
        setShowCompleted(true)
      }, 3000)
    }
  }

  return (
    <>
      <Card>
        <CardBody>
          {errorText && <Alert status="error">{errorText}</Alert>}
          <ChatContainer side="left">
            <Avatar
              size="sm"
              name="agent"
              src="https://res.cloudinary.com/dpwytlrc2/image/upload/v1750250580/avatar_svg_iye4pz.svg"
            />
            <ChatBubble>
              <TypeWriter text="Heey! I hear you're looking for some work? Set your parameters below and I can get a dispatch sorted for you." />
            </ChatBubble>
          </ChatContainer>
          {showParams && (
            <ChatContainer side="right">
              <ChatBubble isUser side="right">
                <Input
                  mb={1}
                  inline
                  id="icaoDep"
                  value={dispatchParams.icaoDep}
                  size="xs"
                  type="text"
                  onChange={handleChange}
                  placeholder="Departure ICAO"
                />
                <Input
                  mb={1}
                  inline
                  id="minSize"
                  value={dispatchParams.minSize}
                  size="xs"
                  type="text"
                  onChange={handleChange}
                  placeholder="min airport size (0-5)"
                />
                <Select
                  my={1}
                  size="xs"
                  id="cargoType"
                  value={dispatchParams.cargoType}
                  onChange={handleChange}
                  placeholder="Select cargo type"
                >
                  <option value="cargo">Cargo</option>
                  <option value="pax">PAX</option>
                </Select>
                <Input
                  my={1}
                  inline
                  id="maxCargo"
                  value={dispatchParams.maxCargo}
                  size="xs"
                  type="text"
                  onChange={handleChange}
                  placeholder={`${
                    dispatchParams.cargoType === null
                      ? 'Select cargo type'
                      : dispatchParams.cargoType === 'cargo'
                        ? 'Max Cargo (lbs)'
                        : 'Max PAX'
                  }`}
                />
                <Input
                  my={1}
                  inline
                  id="maxDistance"
                  value={dispatchParams.maxDistance}
                  size="xs"
                  type="text"
                  onChange={handleChange}
                  placeholder="Max Distances (nm)"
                />
                <Select
                  my={1}
                  size="xs"
                  id="aircraftSize"
                  value={dispatchParams.aircraftSize}
                  onChange={handleChange}
                  placeholder="Select aircraft size"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </Select>
                {paramsError && (
                  <Text fontSize="xs" color="red.500">
                    {paramsError}
                  </Text>
                )}
                <Button size="xs" onClick={() => submitDispatchRequest()}>
                  Request Job
                </Button>
              </ChatBubble>
              <Avatar size="sm" name={auth.user.name} />
            </ChatContainer>
          )}
          {dispatchData && (
            <>
              <ChatContainer side="left">
                <Avatar
                  size="sm"
                  name="agent"
                  src="https://res.cloudinary.com/dpwytlrc2/image/upload/v1750250580/avatar_svg_iye4pz.svg"
                />
                <ChatBubble>
                  <DispatchDetails dispatchDetails={dispatchData} />
                </ChatBubble>
              </ChatContainer>
            </>
          )}
          {showAcceptance && (
            <>
              <ChatContainer side="left">
                <Avatar
                  size="sm"
                  name="agent"
                  src="https://res.cloudinary.com/dpwytlrc2/image/upload/v1750250580/avatar_svg_iye4pz.svg"
                />
                <ChatBubble side="left">
                  <TypeWriter text="Woould you like to accept?" />
                </ChatBubble>
              </ChatContainer>
              <Flex gap={2} mt={2} ml={24} justify="flex-start">
                <Button
                  size="xs"
                  colorScheme="gray"
                  onClick={() => submitAcceptance(false)}
                >
                  Decline
                </Button>
                <Button size="xs" onClick={() => submitAcceptance(true)}>
                  Accept
                </Button>
              </Flex>
            </>
          )}

          {showUserAcceptance && (
            <>
              <ChatContainer side="right">
                <ChatBubble isUser side="right">
                  Yes please!
                </ChatBubble>
                <Avatar size="sm" name={auth.user.name} />
              </ChatContainer>
            </>
          )}

          {showBooking && (
            <ChatContainer side="left">
              <Avatar
                size="sm"
                name="agent"
                src="https://res.cloudinary.com/dpwytlrc2/image/upload/v1750250580/avatar_svg_iye4pz.svg"
              />
              <ChatBubble>
                <TypeWriter text="Okk! Great, I will get that booked for you!" />
              </ChatBubble>
            </ChatContainer>
          )}

          {showCompleted && (
            <ChatContainer side="left">
              <Avatar
                size="sm"
                name="agent"
                src="https://res.cloudinary.com/dpwytlrc2/image/upload/v1750250580/avatar_svg_iye4pz.svg"
              />
              <ChatBubble>
                <TypeWriter text="Thhat's all done! Head over to the dispatch screen to get ready for the flight." />
              </ChatBubble>
            </ChatContainer>
          )}

          <Box>{typing && <TypingIndicator />}</Box>
        </CardBody>
      </Card>
    </>
  )
}

ContractGenerator.layout = (page) => (
  <AppLayout
    children={page}
    title="Contract Generator"
    heading="Contract Generator"
  />
)

export default ContractGenerator
