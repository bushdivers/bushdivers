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
import { ArrowUp, Check, Plane } from 'lucide-react'
import React from 'react'

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
  type = 'available',
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
              <Box p={1}>
                <Icon as={Plane} />
              </Box>
              <Link href={`/airports/${contract.arr_airport.identifier}`}>
                <Text fontSize="xl">{contract.arr_airport.identifier}</Text>
              </Link>
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
          <Text fontSize="lg">
            $
            {parseFloat(contract.contract_value).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </Text>
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
              <Text fontSize="xs">
                Expires In{' '}
                {formatDistanceToNowStrict(new Date(contract.expires_at))}
              </Text>
            </Flex>
          </Box>
        </Box>
      </CardBody>
    </Card>
  )
}

export default ContractDetail
