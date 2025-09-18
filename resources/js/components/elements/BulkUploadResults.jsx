import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Collapse,
  Flex,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

const BulkUploadResults = ({
  results,
  title = 'Bulk Upload Results',
  successMessage = 'item(s) successfully created',
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    if (results) {
      setIsVisible(true)
      setShouldRender(true)
    }
  }, [results])

  const handleClear = () => {
    setIsVisible(false)
    setTimeout(() => setShouldRender(false), 300)
  }

  if (!results || !shouldRender) return null

  return (
    <Collapse in={isVisible} animateOpacity>
      <Box
        mt={4}
        mb={4}
        p={4}
        bg="gray.50"
        borderRadius="md"
        border="1px solid"
        borderColor="gray.200"
      >
        <Flex justify="space-between" align="center" mb={3}>
          <Text fontWeight="semibold" color="gray.700" fontSize="sm">
            📊 {title}
          </Text>
          <Button
            size="xs"
            variant="ghost"
            onClick={handleClear}
            colorScheme="gray"
          >
            Clear
          </Button>
        </Flex>

        <SimpleGrid columns={3} gap={3} mb={3}>
          <Box textAlign="center">
            <Text fontSize="xs" color="gray.500" mb={1}>
              Total Rows
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              {results.total_rows}
            </Text>
          </Box>
          <Box textAlign="center">
            <Text fontSize="xs" color="gray.500" mb={1}>
              Successful
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="green.500">
              {results.successful}
            </Text>
          </Box>
          <Box textAlign="center">
            <Text fontSize="xs" color="gray.500" mb={1}>
              Errors
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="red.500">
              {results.errors ? results.errors.length : 0}
            </Text>
          </Box>
        </SimpleGrid>

        {results.errors && results.errors.length > 0 && (
          <Alert status="error" mb={3} size="sm">
            <AlertIcon boxSize="14px" />
            <Box flex="1">
              <Text fontWeight="medium" mb={2} fontSize="sm">
                Error Details
              </Text>
              <Box
                maxHeight="120px"
                overflowY="auto"
                bg="red.50"
                p={2}
                borderRadius="sm"
                fontSize="xs"
              >
                {results.errors.map((error, index) => (
                  <Text key={index} mb={1}>
                    <Text as="span" fontWeight="medium">
                      Row {error.row}:
                    </Text>{' '}
                    {error.message}
                  </Text>
                ))}
              </Box>
            </Box>
          </Alert>
        )}

        {results.successful > 0 && (
          <Alert status="success" size="sm">
            <AlertIcon boxSize="14px" />
            <Text fontSize="sm">
              {results.successful} {successMessage}
            </Text>
          </Alert>
        )}
      </Box>
    </Collapse>
  )
}

export default BulkUploadResults
