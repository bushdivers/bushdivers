import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import { formatDistanceToNowStrict } from 'date-fns'
import { Anchor, ArrowUp, Check, Plane } from 'lucide-react'
import React from 'react'

import AvailableFuel from '../airport/AvailableFuel.jsx'
import Tooltip from '../elements/Tooltip'

function renderCargo(contract) {
  let cargoType
  switch (contract.cargo_type) {
    case 1:
      cargoType = ' lbs'
      break
    case 2:
      cargoType = ''
      break
  }
  return `${parseFloat(contract.cargo_qty).toLocaleString()}${cargoType} ${
    contract.cargo
  }`
}

const ContractDetail = ({
  contract,
  action,
  selectedContract = null,
  updateSelectedContract,
}) => {
  return (
    <Card
      cursor="pointer"
      bgColor={
        selectedContract && selectedContract.id === contract.id
          ? useColorModeValue('orange.300', 'orange.800')
          : ''
      }
      onClick={() => updateSelectedContract(contract)}
    >
      <CardBody>
        <Box>
          <Flex justifyContent="space-between" gap={2}>
            <Flex alignItems="center" gap={2}>
              <Link href={`/airports/${contract.current_airport_id}`}>
                <Text fontSize="xl">{contract.current_airport_id}</Text>
              </Link>
              {contract.dep_airport.longest_runway_surface === 'W' && (
                <Icon as={Anchor} color="blue.500" />
              )}
              <Box p={1}>
                <Icon as={Plane} />
              </Box>
              <Link href={`/airports/${contract.arr_airport.identifier}`}>
                <Text fontSize="xl">{contract.arr_airport.identifier}</Text>
              </Link>
              {contract.arr_airport.longest_runway_surface === 'W' && (
                <Icon as={Anchor} color="blue.500" />
              )}
            </Flex>
            <Box mr={4}>
              <Tooltip content="Bid">
                <Button
                  colorScheme="gray"
                  size="xs"
                  onClick={() => action(contract)}
                >
                  <Icon as={Check} />
                </Button>
              </Tooltip>
            </Box>
          </Flex>
          <Text my={2} fontSize="lg">
            $
            {parseFloat(contract.contract_value).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </Text>
          <Flex justifyContent="space-between">
            <Box>
              <Flex justifyContent="start" gap={2}>
                <Flex>{contract.distance} nm</Flex>
                <Flex alignItems="center">
                  <Box style={{ transform: `rotate(${contract.heading}deg)` }}>
                    <Icon as={ArrowUp} />
                  </Box>
                  <Box ml={1}>{contract.heading}&deg;</Box>
                </Flex>
              </Flex>
              <Flex gap={4}>
                <Text fontSize="xs">{renderCargo(contract)}</Text>
              </Flex>
              <Text fontSize="xs">
                Expires In{' '}
                {formatDistanceToNowStrict(new Date(contract.expires_at))}
              </Text>
            </Box>
            <AvailableFuel airport={contract.arr_airport} stack={true} />
          </Flex>
        </Box>
      </CardBody>
    </Card>
  )
}

export default ContractDetail
