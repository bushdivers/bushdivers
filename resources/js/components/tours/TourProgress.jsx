import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import React from 'react'

const TourProgress = ({ progress }) => {
  return (
    <CircularProgress color="orange.500" size="35px" value={progress}>
      <CircularProgressLabel>{progress}%</CircularProgressLabel>
    </CircularProgress>
  )
}

export default TourProgress
