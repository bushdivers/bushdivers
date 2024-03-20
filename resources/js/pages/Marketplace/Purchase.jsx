import { Box, Text } from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

import AppLayout from '../../components/layout/AppLayout'
import NewPurchase from '../../components/marketplace/NewPurchase.jsx'
import UsedPurchase from '../../components/marketplace/UsedPurchase.jsx'

const Purchase = ({ aircraft, purchaseType }) => {
  const { auth } = usePage().props
  const [hub, setHub] = useState(null)
  const [hubError, setHubError] = useState(null)
  const [reg, setReg] = useState(
    purchaseType === 'used' ? aircraft.registration : ''
  )
  const [regError, setRegError] = useState(null)
  const [deliveryLocation, setDeliveryLocation] = useState(aircraft.hq)
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

  const purchase = (price) => {
    setError(null)
    setHubError(null)
    setRegError(null)

    if (reg == null || reg.length > 7) {
      setRegError(
        'Registration must be at least 1 character and no more than 7'
      )
      return
    }

    if (hub == null) {
      setHubError('Please enter home hub ICAO')
      return
    }

    if (parseFloat(price) > auth.user.balance) {
      window.alert('You do not have sufficient funds')
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
    router.post('/marketplace/purchase', data)
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
