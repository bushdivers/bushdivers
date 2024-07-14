import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Progress,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React, { useMemo } from 'react'

const DashTableCard = (props) => {
  const maxItemVal = useMemo(() => {
    if (!props.data) return 0
    return props.data.reduce(
      (max, item) => (parseFloat(item.num) > max ? parseFloat(item.num) : max),
      0
    )
  })

  return (
    <Card>
      <CardHeader>{props.title}</CardHeader>
      <CardBody>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>{props.itemName}</Th>
                <Th isNumeric>{props.unit ?? 'Count'}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!!props.data &&
                props.data.map((item) => (
                  <Tr key={item.id}>
                    <Td colSpan={2}>
                      <Flex>
                        {props.children?.(item)}
                        <Spacer />
                        <Text>{item.num}</Text>
                      </Flex>
                      <Progress
                        mt={'0.5em'}
                        size={'sm'}
                        value={parseFloat(item.num)}
                        max={maxItemVal}
                      ></Progress>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  )
}

export default DashTableCard
