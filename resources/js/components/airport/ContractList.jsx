import {
  Alert,
  AlertIcon,
  Box,
  Card,
  Flex,
  Heading,
  Tag,
  Text,
} from '@chakra-ui/react'
import { Link, router, usePage } from '@inertiajs/react'
import axios from 'axios'
import { useAtomValue } from 'jotai'
import React from 'react'

import { contractMapLayersAtom } from '../../state/map.state.js'
import ContractDetail from '../contracts/ContractDetail.jsx'

const ContractList = ({ contracts, myContracts, sharedContracts }) => {
  const { auth } = usePage().props
  const contractMapLayers = useAtomValue(contractMapLayersAtom)
  async function bidForContract(contract) {
    // await updateSelectedContract(null)
    const data = {
      id: contract.id,
      userId: auth.user.id,
      action: 'bid',
    }
    await axios.post('/api/contracts/bid', data)

    router.reload({ only: ['contracts'] })
  }
  return (
    <>
      <Card
        position="absolute"
        w={300}
        h={
          contractMapLayers.fleet || contractMapLayers.myAircraft
            ? '49%'
            : '100%'
        }
      >
        <Box p={2} overflowY="auto">
          {contractMapLayers.myContracts && (
            <>
              <Heading size="sm">My Contracts</Heading>
              {myContracts &&
                myContracts.map((c) => (
                  <ContractDetail key={c.id} contract={c} type="mine" />
                ))}
            </>
          )}
          {contractMapLayers.sharedContracts && (
            <>
              <Heading size="sm">Shared Contracts</Heading>
              {sharedContracts &&
                sharedContracts.map((c) => (
                  <ContractDetail key={c.id} contract={c} type="shared" />
                ))}
            </>
          )}
          <Flex alignItems="center" justifyContent="space-between">
            <Heading size="sm">Available Contracts</Heading>
            <Tag colorScheme="green">Available</Tag>
          </Flex>
          <Alert cursor="pointer" status="info" mt={2}>
            <AlertIcon />
            <Text size="sm">
              <Link href="/contracts/experimental">
                Try our experimental contract generator
              </Link>
            </Text>
          </Alert>
          {contracts &&
            contracts.map((c) => (
              <ContractDetail
                key={c.id}
                contract={c}
                action={bidForContract}
                type="available"
              />
            ))}
        </Box>
      </Card>
    </>
  )
}

export default ContractList
