import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import { usePage } from '@inertiajs/react'
import React from 'react'

const DEFAULT_FILTERS = {
  search: '',
  aircraftType: '',
  manufacturer: '',
  purchaseType: '',
  priceMin: '',
  priceMax: '',
  cargoMin: '',
  cargoMax: '',
  hasFloats: false,
}

const MarketplaceFilters = ({ filters, onChange, manufacturers }) => {
  const { aircraftTypes } = usePage().props
  const aircraftTypeOptions = [
    { value: '', label: 'All types' },
    ...(aircraftTypes ?? []),
  ]

  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value })
  }

  const handleReset = () => {
    onChange(DEFAULT_FILTERS)
  }

  return (
    <Card mb={6}>
      <CardBody>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
          <FormControl>
            <FormLabel fontSize="sm">Search</FormLabel>
            <Input
              placeholder="Name, code or manufacturer..."
              size="sm"
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Type</FormLabel>
            <Select
              size="sm"
              value={filters.aircraftType}
              onChange={(e) => handleChange('aircraftType', e.target.value)}
            >
              {aircraftTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Manufacturer</FormLabel>
            <Select
              size="sm"
              value={filters.manufacturer}
              onChange={(e) => handleChange('manufacturer', e.target.value)}
            >
              <option value="">All manufacturers</option>
              {manufacturers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <Flex alignItems="flex-end" pb={1}>
            <Checkbox
              isChecked={filters.hasFloats}
              onChange={(e) => handleChange('hasFloats', e.target.checked)}
              size="sm"
            >
              <Text fontSize="sm">Float option available</Text>
            </Checkbox>
          </Flex>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4} mt={4}>
          <FormControl>
            <FormLabel fontSize="sm">Purchase type</FormLabel>
            <ButtonGroup size="sm" isAttached>
              {[
                { value: '', label: 'All' },
                { value: 'new', label: 'New' },
                { value: 'used', label: 'Used' },
              ].map((opt) => (
                <Button
                  key={opt.value}
                  variant={
                    filters.purchaseType === opt.value ? 'solid' : 'outline'
                  }
                  colorScheme={
                    filters.purchaseType === opt.value ? 'orange' : 'gray'
                  }
                  onClick={() => handleChange('purchaseType', opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </ButtonGroup>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">
              {filters.purchaseType === 'new'
                ? 'New price'
                : 'Used price (low)'}
            </FormLabel>
            <Flex gap={2}>
              <InputGroup size="sm">
                <InputLeftAddon>$</InputLeftAddon>
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => handleChange('priceMin', e.target.value)}
                />
              </InputGroup>
              <InputGroup size="sm">
                <InputLeftAddon>$</InputLeftAddon>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => handleChange('priceMax', e.target.value)}
                />
              </InputGroup>
            </Flex>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Cargo capacity (lbs)</FormLabel>
            <Flex gap={2}>
              <Input
                size="sm"
                type="number"
                placeholder="Min"
                value={filters.cargoMin}
                onChange={(e) => handleChange('cargoMin', e.target.value)}
              />
              <Input
                size="sm"
                type="number"
                placeholder="Max"
                value={filters.cargoMax}
                onChange={(e) => handleChange('cargoMax', e.target.value)}
              />
            </Flex>
          </FormControl>

          <Flex alignItems="flex-end">
            <Button size="sm" variant="ghost" onClick={handleReset}>
              Clear all
            </Button>
          </Flex>
        </SimpleGrid>
      </CardBody>
    </Card>
  )
}

export { DEFAULT_FILTERS }
export default MarketplaceFilters
