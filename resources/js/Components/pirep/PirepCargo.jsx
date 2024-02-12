import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React from 'react'

const PirepCargo = (props) => {
  return (
    <Box mt={2}>
      <Card>
        <CardHeader>Cargo</CardHeader>
        <CardBody>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>Contract</Th>
                  <Th>Pick Up</Th>
                  <Th>Destination</Th>
                  <Th>Distance</Th>
                  <Th>Heading</Th>
                  <Th>Type</Th>
                  <Th>Cargo</Th>
                </Tr>
              </Thead>
              <Tbody>
                {props.cargo.map((detail) => (
                  <Tr key={detail.id}>
                    <Td>{detail.id}</Td>
                    <Td>{detail.dep_airport_id}</Td>
                    <Td>{detail.arr_airport_id}</Td>
                    <Td>
                      {detail.distance.toLocaleString(navigator.language)}
                    </Td>
                    <Td>{detail.heading}</Td>
                    <Td>{detail.cargo_type === 1 ? 'Cargo' : 'Passenger'}</Td>
                    <Td>
                      {detail.cargo_type === 1 ? (
                        <>
                          <Text>
                            {detail.cargo_qty.toLocaleString(
                              navigator.language
                            )}{' '}
                            lbs
                          </Text>{' '}
                          <Text fontSize="xs">{detail.cargo}</Text>
                        </>
                      ) : (
                        <>
                          <Text>{detail.cargo_qty}</Text>{' '}
                          <Text fontSize="xs">{detail.cargo}</Text>
                        </>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
    </Box>
  )
}

export default PirepCargo
