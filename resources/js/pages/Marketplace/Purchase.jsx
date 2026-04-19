import { Box, Text, useToast } from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

import AppLayout from '../../components/layout/AppLayout'
import NewPurchase from '../../components/marketplace/NewPurchase.jsx'
import UsedPurchase from '../../components/marketplace/UsedPurchase.jsx'

const Purchase = ({ aircraft, purchaseType, buyer, hubs }) => {
  const { auth } = usePage().props
  const toast = useToast()
  const [hub, setHub] = useState('')
  const [hubError, setHubError] = useState(null)
  const [reg, setReg] = useState(
    purchaseType === 'used' ? aircraft.registration : ''
  )
  const [regError, setRegError] = useState(null)
  const [deliveryLocation, setDeliveryLocation] = useState(
    aircraft.hq?.identifier ?? ''
  ) // aircraft is fleet object for new purchases
  const [error, setError] = useState(null)

  const handleHubChange = (e) => {
    setHub(e.target.value)
  }

  const handleRegChange = (e) => {
    console.log(e.target.value)
    setRegError(null)
    if (e.target.value.length > 8) {
      setRegError('Registration cannot be more than 8 characters')
      return
    }
    setReg(e.target.value)
  }

  const handleDeliveryChange = (location) => {
    setDeliveryLocation(location)
  }

  const purchase = async (price) => {
    setError(null)
    setHubError(null)
    setRegError(null)

    if (reg == null || reg.length > 8) {
      setRegError(
        'Registration must be at least 1 character and no more than 8'
      )
      return
    }

    if (hub == null || hub.length === 0) {
      setHubError('Please enter home hub ICAO')
      return
    }

    if (buyer === 'user' && parseFloat(price) > auth.user.balance) {
      toast({
        title: 'Insufficient Funds',
        description: 'You do not have sufficient funds.',
        status: 'error',
        isClosable: true,
      })
      return
    }
    const data = {
      total: parseFloat(price),
      id: aircraft.id,
      deliveryIcao:
        purchaseType === 'new' ? deliveryLocation : aircraft.current_airport_id,
      hub,
      reg,
      purchaseType,
    }
    router.post(`/marketplace/purchase/${buyer}`, data)
  }

  return (
    <Box>
      {purchaseType === 'new' ? (
        <NewPurchase
          aircraft={aircraft}
          hub={hub}
          handleHubChange={handleHubChange}
          hubError={hubError}
          reg={reg}
          handleRegChange={handleRegChange}
          regError={regError}
          purchase={purchase}
          updateDelivery={handleDeliveryChange}
          buyer={buyer}
          hubs={hubs}
        />
      ) : (
        <UsedPurchase
          aircraft={aircraft}
          hub={hub}
          handleHubChange={handleHubChange}
          reg={reg}
          handleRegChange={handleRegChange}
          regError={regError}
          hubError={hubError}
          purchase={purchase}
          buyer={buyer}
          hubs={hubs}
        />
      )}
      {error && (
        <Text fontSize="sm" mt={1} color="red.500">
          {error}
        </Text>
      )}
    </Box>
  )
}

Purchase.layout = (page) => (
  <AppLayout
    children={page}
    title="Marketplace - Invoice"
    heading="Marketplace - Invoice"
  />
)

export default Purchase
