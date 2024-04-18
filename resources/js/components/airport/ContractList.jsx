import { Box, Card } from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import axios from 'axios'
import { useAtomValue } from 'jotai'
import React from 'react'

import { contractMapLayersAtom } from '../../state/map.state.js'
import ContractDetail from '../contracts/ContractDetail.jsx'

const ContractList = ({
  contracts,
  selectedContract,
  updateSelectedContract,
}) => {
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
          {contracts &&
            contracts.map((c) => (
              <ContractDetail
                key={c.id}
                contract={c}
                selectedContract={selectedContract}
                action={bidForContract}
                type="search"
                updateSelectedContract={updateSelectedContract}
              />
            ))}
        </Box>
      </Card>
    </>
  )
}

export default ContractList
