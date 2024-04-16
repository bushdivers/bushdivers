import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import { format } from 'date-fns'
import React from 'react'

import Pagination from '../../components/elements/Pagination'
import AppLayout from '../../components/layout/AppLayout'
import { displayNumber } from '../../helpers/number.helpers'

const renderTransactionType = (transactionType) => {
  switch (transactionType) {
    case 1:
      return 'Contract Pay'
    case 2:
      return 'Jumpseat'
    case 3:
      return 'Contract Cancellation'
    case 4:
      return 'Refuel Penalty'
    case 5:
      return 'Bonus Pay (i.e returning aircraft to hub)'
    case 6:
      return 'Aircraft Rental Fees'
    case 7:
      return 'Fuel Fees'
    case 8:
      return 'Ground Handling Fees'
    case 9:
      return 'Landing Fees'
    case 10:
      return 'Aircraft Maintenance Fees'
    case 11:
      return 'Monthly Aircraft Ownership cost'
    case 12:
      return 'Aircraft Purchase'
    case 13:
      return 'Aircraft Sale'
    case 14:
      return 'Loan'
    default:
      return 'Other'
  }
}

const MyFinances = ({ accounts, balance, loanAvailable }) => {
  const { auth } = usePage().props

  function handleBorrowClick() {
    const value = window.prompt('Enter amount to borrow')
    if (parseFloat(value) > loanAvailable) {
      window.alert(
        'Amount to borrow must be less than or equal to available amount!'
      )
    } else {
      router.post('/loans', { loanAmount: value, transaction: 'borrow' })
    }
  }

  function handleRepayClick() {
    const value = window.prompt('Enter amount to repay')
    if (parseFloat(value) > auth.user.loan) {
      window.alert(
        'Amount to repay must be less than or equal to current amount!'
      )
    } else {
      router.post('/loans', { loanAmount: value, transaction: 'repay' })
    }
  }

  return (
    <SimpleGrid columns={2} gap={2}>
      <Card>
        <CardBody>
          <TableContainer>
            <Table className="table table-compact w-full overflow-x-auto">
              <Thead>
                <Tr>
                  <Th>Amount</Th>
                  <Th>Transaction Type</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {accounts.data.map((row) => (
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
                      <span>{renderTransactionType(row.type)}</span>
                    </Td>
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
          <Box mt={2}>
            <Pagination pages={accounts} />
          </Box>
        </CardBody>
      </Card>
      <Box>
        <Card>
          <CardHeader>
            <Heading size="md">Current Balance</Heading>
          </CardHeader>
          <CardBody>
            <Heading size="lg">${displayNumber(balance)}</Heading>
          </CardBody>
        </Card>
        <Card mt={2}>
          <CardHeader>
            <Heading size="md">Current Loan</Heading>
          </CardHeader>
          <CardBody>
            <Flex alignItems="center" gap={4}>
              <Heading size="lg">
                ${auth.user.loan > 0.0 ? '-' : ''}
                {displayNumber(auth.user.loan)}
              </Heading>
              {auth.user.loan > 0 && (
                <Button size="sm" onClick={() => handleRepayClick()}>
                  Repay
                </Button>
              )}
            </Flex>
          </CardBody>
        </Card>
        <Card mt={2}>
          <CardHeader>
            <Heading size="md">Available to Borrow</Heading>
          </CardHeader>
          <CardBody>
            <Flex alignItems="center" gap={4}>
              <Heading size="lg">${displayNumber(loanAvailable)}</Heading>
              {loanAvailable >= 1 && (
                <Button size="sm" onClick={() => handleBorrowClick()}>
                  Borrow
                </Button>
              )}
            </Flex>
          </CardBody>
        </Card>
      </Box>
      <div className="md:w-1/4 md:mx-2"></div>
    </SimpleGrid>
  )
}

MyFinances.layout = (page) => (
  <AppLayout children={page} title="My Finances" heading="My Finances" />
)

export default MyFinances
