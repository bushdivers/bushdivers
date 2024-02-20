import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

const Pagination = (props) => {
  return (
    <Box>
      <Box>
        <Text fontSize="sm">
          Showing
          <Text as="b" mx={1}>
            {props.pages.from}
          </Text>
          to
          <Text as="b" mx={1}>
            {props.pages.to}
          </Text>
          of
          <Text as="b" mx={1}>
            {props.pages.total}
          </Text>
          results
        </Text>
      </Box>
      {props.pages.total > props.pages.per_page && (
        <Flex mt={2} alignItems="center" gap={2}>
          <Link href={props.pages.prev_page_url} className="btn btn-secondary">
            <Button size="sm" className="sr-only">
              <Icon as={ChevronLeft} />
            </Button>
          </Link>
          <Link href={props.pages.next_page_url} className="btn btn-secondary">
            <Button size="sm" className="sr-only">
              <Icon as={ChevronRight} />
            </Button>
          </Link>
        </Flex>
      )}
    </Box>
  )
}

export default Pagination
