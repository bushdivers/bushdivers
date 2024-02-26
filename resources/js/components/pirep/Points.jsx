import { Box, Card, CardBody, CardHeader, Flex } from '@chakra-ui/react'
import React from 'react'

import StatDisplay from '../elements/StatDisplay.jsx'

const Points = (props) => {
  return (
    <Box mt={2}>
      <Card>
        <CardHeader>Points Awarded</CardHeader>
        <CardBody>
          {props.points.length > 0 && (
            <Flex justifyContent="space-between">
              {props.points.map((point) => (
                <StatDisplay
                  key={point.id}
                  title={point.type_name}
                  stat={point.points.toLocaleString(navigator.language)}
                />
              ))}
            </Flex>
          )}
        </CardBody>
      </Card>
    </Box>
  )
}

export default Points
