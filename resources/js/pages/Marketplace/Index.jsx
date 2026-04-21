import { Box, Button, Flex, SimpleGrid, Text } from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import React, { useMemo, useState } from 'react'

import AppLayout from '../../components/layout/AppLayout'
import AircraftCard from '../../components/marketplace/AircraftCard.jsx'
import AircraftDetailModal from '../../components/marketplace/AircraftDetailModal.jsx'
import MarketplaceFilters, {
  DEFAULT_FILTERS,
} from '../../components/marketplace/MarketplaceFilters.jsx'

const Index = ({ fleet, manufacturers, buyer }) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [selectedFleet, setSelectedFleet] = useState(null)

  const filteredFleet = useMemo(() => {
    return fleet.filter((f) => {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const matchesName = f.name.toLowerCase().includes(q)
        const matchesCode = f.type?.toLowerCase().includes(q)
        const matchesMfg = f.manufacturer?.name?.toLowerCase().includes(q)
        if (!matchesName && !matchesCode && !matchesMfg) {
          return false
        }
      }

      if (
        filters.aircraftType !== '' &&
        String(f.aircraft_type) !== String(filters.aircraftType)
      ) {
        return false
      }

      if (
        filters.manufacturer !== '' &&
        String(f.manufacturer_id) !== String(filters.manufacturer)
      ) {
        return false
      }

      if (filters.purchaseType === 'new' && !f.can_purchase_new) {
        return false
      }

      const priceField =
        filters.purchaseType === 'new' ? f.new_price : f.used_low_price

      if (filters.priceMin !== '' && priceField < Number(filters.priceMin)) {
        return false
      }

      if (filters.priceMax !== '' && priceField > Number(filters.priceMax)) {
        return false
      }

      const cargo = f.default_variant?.cargo_capacity ?? 0
      if (filters.cargoMin !== '' && cargo < Number(filters.cargoMin)) {
        return false
      }

      if (filters.cargoMax !== '' && cargo > Number(filters.cargoMax)) {
        return false
      }

      if (filters.hasFloats && !f.has_floats) {
        return false
      }

      return true
    })
  }, [fleet, filters])

  const handleCardClick = (f) => {
    setSelectedFleet(f)
  }

  const handleModalClose = () => {
    setSelectedFleet(null)
  }

  const modalActions = selectedFleet ? (
    <>
      {!!selectedFleet.can_purchase_new && (
        <Button
          onClick={() =>
            router.get(`/marketplace/purchase/new/${selectedFleet.id}/${buyer}`)
          }
        >
          Purchase New
        </Button>
      )}
      <Button
        variant="outline"
        onClick={() =>
          router.get(`/marketplace/list/used/${selectedFleet.id}/${buyer}`)
        }
      >
        View Used Aircraft
      </Button>
    </>
  ) : null

  return (
    <Box>
      <MarketplaceFilters
        filters={filters}
        onChange={setFilters}
        manufacturers={manufacturers}
      />

      <Flex justifyContent="flex-end" mb={4}>
        <Text fontSize="sm" color="gray.500">
          Showing {filteredFleet.length} of {fleet.length} aircraft
        </Text>
      </Flex>

      {filteredFleet.length === 0 ? (
        <Flex justifyContent="center" py={16}>
          <Text color="gray.400">No aircraft match your filters.</Text>
        </Flex>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={5}>
          {filteredFleet.map((f) => (
            <AircraftCard
              key={f.id}
              fleet={f}
              buyer={buyer}
              onClick={() => handleCardClick(f)}
            />
          ))}
        </SimpleGrid>
      )}

      <AircraftDetailModal
        fleet={selectedFleet}
        isOpen={!!selectedFleet}
        onClose={handleModalClose}
        actions={modalActions}
      />
    </Box>
  )
}

Index.layout = (page) => (
  <AppLayout children={page} title="Marketplace" heading="Marketplace" />
)

export default Index
