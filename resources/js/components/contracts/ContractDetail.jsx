import {
  Box,
  Button,
  Card,
  Flex,
  Icon,
  Tag,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { formatDistanceToNowStrict } from 'date-fns'
import { useAtom } from 'jotai'
import { ArrowUp, Check, Plane } from 'lucide-react'
import React from 'react'

import { selectedContractAtom } from '../../state/contract.state.js'
import AirportLabel from '../airport/AirportLabel.jsx'
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

const ContractDetail = ({ contract, action = null, type }) => {
  const [selectedContract, setSelectedContract] = useAtom(selectedContractAtom)
  return (
    <Card
      my={2}
      py={2}
      px={3}
      cursor="pointer"
      bgColor={
        selectedContract && selectedContract.id === contract.id
          ? useColorModeValue('orange.300', 'orange.800')
          : ''
      }
      onClick={() =>
        setSelectedContract(contract === selectedContract ? null : contract)
      }
    >
      <Box>
        <Flex justifyContent="space-between" gap={1}>
          <Flex alignItems="center" gap={1}>
            <AirportLabel airport={contract.dep_airport} size="lg" />
            <Box p={1}>
              <Icon as={Plane} />
            </Box>
            <AirportLabel airport={contract.arr_airport} size="lg" />
          </Flex>
          {type === 'available' ? (
            <Box>
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
          ) : type === 'mine' ? (
            <Tag size="sm" colorScheme="blue">
              Mine
            </Tag>
          ) : (
            <Tag size="sm" colorScheme="orange">
              Shared
            </Tag>
          )}
        </Flex>
        <Text my={1} as="b" fontSize="sm">
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
    </Card>
  )
}

export default ContractDetail
