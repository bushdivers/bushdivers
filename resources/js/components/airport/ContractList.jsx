import { Box, Card } from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import axios from 'axios'
import React from 'react'

import ContractDetail from '../contracts/ContractDetail.jsx'

const ContractList = ({
  contracts,
  currentViews,
  selectedContract,
  updateSelectedContract,
}) => {
  const { auth } = usePage().props
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
      {currentViews.includes('contracts') && contracts.length > 0 && (
        <Card position="absolute" w={300} top={12} bottom={12} left={4}>
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
      )}
    </>
  )
}

export default ContractList