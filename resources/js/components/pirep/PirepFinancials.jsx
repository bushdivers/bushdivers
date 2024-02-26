import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
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

const PirepFinancials = (props) => {
  const renderCompanyTransactionType = (transaction) => {
    switch (transaction) {
      case 5:
        return 'Ground Handling'
      case 6:
        return 'Landing Fee'
      case 7:
        return 'Fuel Cost'
      case 8:
        return 'Contract Income'
      case 9:
        return 'Pilot Pay'
    }
  }

  const renderPilotTransactionType = (transaction) => {
    switch (transaction) {
      case 1:
        return 'Contract Pay'
      case 4:
        return 'Landing Fee'
      case 5:
        return 'Bonus'
      case 6:
        return 'Rental Fees'
      case 7:
        return 'Fuel Cost'
      case 8:
        return 'Ground Handling'
      case 9:
        return 'Landing Fees'
    }
  }

  return (
    <Box mt={2}>
      <Card>
        <CardHeader>Pirep Financials</CardHeader>
        <CardBody>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>Transaction</Th>
                  <Th>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {props.company.map((company) => (
                  <Tr key={company.id}>
                    <Td>
                      {renderCompanyTransactionType(company.transaction_type)} -{' '}
                      {company.memo}
                    </Td>
                    <Td>
                      <Text color={company.total < 0 ? 'red.500' : undefined}>
                        ${company.total.toLocaleString(navigator.language)}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Flex justifyContent="right" className="text-right">
              <Text color={props.company.total < 0 ? 'red.500' : undefined}>
                Total: ${props.companyTotal.toLocaleString(navigator.language)}
              </Text>
            </Flex>
          </TableContainer>
        </CardBody>
      </Card>
      <Card mt={2}>
        <CardHeader>Pilot Financials</CardHeader>
        <CardBody>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>Transaction</Th>
                  <Th>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {props.pilot.map((pilot) => (
                  <Tr key={pilot.id}>
                    <Td>{renderPilotTransactionType(pilot.type)}</Td>
                    <Td>
                      <Text color={pilot.total < 0 ? 'red.500' : undefined}>
                        ${pilot.total.toLocaleString(navigator.language)}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex justifyContent="right">
            <Text color={props.pilotTotal < 0 ? 'text-red-500' : undefined}>
              Total: ${props.pilotTotal.toLocaleString(navigator.language)}
            </Text>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  )
}

export default PirepFinancials
