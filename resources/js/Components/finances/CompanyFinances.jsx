import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { format } from 'date-fns'
import React from 'react'

import Pagination from '../elements/Pagination.jsx'

const renderTransactionType = (transactionType) => {
  switch (transactionType) {
    case 1:
      return 'Hub Rental'
    case 2:
      return 'Aircraft Storage'
    case 3:
      return 'Aircraft Operations'
    case 4:
      return 'Aircraft Maintenance'
    case 5:
      return 'Ground Handling'
    case 6:
      return 'Landing Fees'
    case 7:
      return 'Fuel Costs'
    case 8:
      return 'Contract Income'
    case 9:
      return 'Contract Pilot Pay'
    case 10:
      return 'General Expenditure'
  }
}

const CompanyFinances = ({ finances }) => {
  return (
    <Box>
      <SimpleGrid columns={2} gap={5}>
        <Box>
          <Heading size="md">Account Balance</Heading>
          <Heading mt={2} size="lg">
            $
            {parseFloat(finances.balance).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </Heading>
        </Box>
        <Box>
          <Heading size="md">Monthly Costs</Heading>
          <h4>Aircraft Operations</h4>
          <span className="text-xl">
            ${parseFloat(finances.aircraftOps).toLocaleString()}
          </span>
          <h4>Aircraft Storage</h4>
          <span className="text-xl">
            ${parseFloat(finances.aircraftStorage).toLocaleString()}
          </span>
          <h4>Hub Rentals</h4>
          <span className="text-xl">
            ${parseFloat(finances.hubs).toLocaleString()}
          </span>
        </Box>
      </SimpleGrid>
      <TableContainer mt={2}>
        <Table className="table table-compact w-full overflow-x-auto">
          <Thead>
            <Tr>
              <Th>Amount</Th>
              <Th>Transaction Type</Th>
              <Th>Memo</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {finances.accounts.data.map((row) => (
              <Tr key={row.id}>
                <Td>
                  <span className="text-right">
                    $
                    {parseFloat(row.total).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </Td>
                <Td>
                  <span>{renderTransactionType(row.transaction_type)}</span>
                </Td>
                <Td>{row.memo}</Td>
                <Td>
                  <span>
                    {format(new Date(row.created_at), 'dd LLL yyyy hh:mm', {
                      timeZone: 'UTC',
                    })}
                  </span>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <div className="mt-2">
        <Pagination pages={finances.accounts} />
      </div>
    </Box>
  )
}

export default CompanyFinances
