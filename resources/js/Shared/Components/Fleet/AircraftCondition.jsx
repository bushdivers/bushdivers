import React from 'react'
import { Progress } from '@chakra-ui/react'

const AircraftCondition = ({ aircraftCondition }) => {
  const conditionColour = (condition) => {
    if (condition >= 75) return 'green'
    if (condition < 75 && condition >= 50) return 'yellow'
    if (condition < 50 && condition > 30) return 'orange'
    if (condition <= 30) return 'red'
  }

  return (
    <Progress colorScheme={conditionColour(aircraftCondition)} bg="gray.800" value={aircraftCondition} />
  )
}

export default AircraftCondition
