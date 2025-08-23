import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
} from '@chakra-ui/react'
import { Link, router, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

import AdminLayout from '../../components/layout/AdminLayout'

const AirportEdit = ({ airport, isEdit, countries }) => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    identifier: airport?.identifier || '',
    name: airport?.name || '',
    location: airport?.location || '',
    country: airport?.country || '',
    country_code: airport?.country_code || '',
    lat: airport?.lat || '',
    lon: airport?.lon || '',
    magnetic_variance: airport?.magnetic_variance || 0,
    altitude: airport?.altitude || '',
    size: airport?.size || '',
    longest_runway_length: airport?.longest_runway_length || '',
    longest_runway_width: airport?.longest_runway_width || '',
    longest_runway_surface: airport?.longest_runway_surface || '',
    has_avgas: airport?.has_avgas || false,
    has_jetfuel: airport?.has_jetfuel || false,
  })

  const [processing, setProcessing] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value
    const selectedCountryData = countries?.find(
      (country) =>
        country.country + '-' + country.country_code === selectedCountry
    )

    setValues((prev) => ({
      ...prev,
      country: selectedCountryData?.country || '',
      country_code: selectedCountryData?.country_code || '',
    }))
  }

  const submit = (e) => {
    e.preventDefault()
    setProcessing(true)

    const url = isEdit
      ? `/admin/airports/edit/${airport.id}`
      : '/admin/airports/create'

    router.post(url, values, {
      onFinish: () => setProcessing(false),
    })
  }

  const runwaySurfaces = {
    A: 'Asphalt',
    B: 'Bituminous',
    C: 'Concrete',
    CE: 'Cement',
    G: 'Grass',
    GR: 'Gravel',
    M: 'Macadam',
    S: 'Sand',
    T: 'Tarmac',
    W: 'Water',
  }

  return (
    <AdminLayout
      heading="Third-Party Airports"
      subHeading="Airport Details"
      actions={
        <Button as={Link} href="/admin/airports" variant="outline" size="sm">
          Back to List
        </Button>
      }
    >
      <Card>
        <CardBody>
          <form onSubmit={submit}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
              {/* Basic Information */}
              <FormControl isInvalid={errors.identifier} isRequired>
                <FormLabel>Airport Identifier</FormLabel>
                <Input
                  name="identifier"
                  value={values.identifier}
                  onChange={handleChange}
                  maxLength={5}
                  textTransform="uppercase"
                />
                <FormErrorMessage>{errors.identifier}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.name} isRequired>
                <FormLabel>Airport Name</FormLabel>
                <Input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.location}>
                <FormLabel>Location</FormLabel>
                <Input
                  name="location"
                  value={values.location}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.location}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.country}>
                <FormLabel>Country</FormLabel>
                {isEdit ? (
                  <Input
                    name="country"
                    value={
                      values.country +
                      (values.country_code
                        ? ' (' + values.country_code + ')'
                        : '')
                    }
                    isDisabled={true}
                    bg="gray.100"
                  />
                ) : (
                  <Select
                    name="country"
                    value={values.country + '-' + values.country_code}
                    onChange={handleCountryChange}
                    placeholder="Select Country"
                  >
                    {countries?.map((country) => (
                      <option
                        key={country.country + '-' + country.country_code}
                        value={country.country + '-' + country.country_code}
                      >
                        {country.country} ({country.country_code})
                      </option>
                    ))}
                  </Select>
                )}
                <FormErrorMessage>{errors.country}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            {/* Coordinates */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
              <FormControl isInvalid={errors.lat} isRequired>
                <FormLabel>Latitude</FormLabel>
                <Input
                  name="lat"
                  type="number"
                  step="any"
                  value={values.lat}
                  onChange={handleChange}
                  min="-90"
                  max="90"
                />
                <FormErrorMessage>{errors.lat}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.lon} isRequired>
                <FormLabel>Longitude</FormLabel>
                <Input
                  name="lon"
                  type="number"
                  step="any"
                  value={values.lon}
                  onChange={handleChange}
                  min="-180"
                  max="180"
                />
                <FormErrorMessage>{errors.lon}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.magnetic_variance}>
                <FormLabel>Magnetic Variance</FormLabel>
                <Input
                  name="magnetic_variance"
                  type="number"
                  step="any"
                  value={values.magnetic_variance}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.magnetic_variance}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            {/* Airport Details */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
              <FormControl isInvalid={errors.altitude}>
                <FormLabel>Altitude (ft)</FormLabel>
                <Input
                  name="altitude"
                  type="number"
                  value={values.altitude}
                  onChange={handleChange}
                  min="0"
                />
                <FormErrorMessage>{errors.altitude}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.size}>
                <FormLabel>Airport Size (1-5)</FormLabel>
                <Select
                  name="size"
                  value={values.size}
                  onChange={handleChange}
                  placeholder="Select Size"
                >
                  <option value="1">1 - Very Small</option>
                  <option value="2">2 - Small</option>
                  <option value="3">3 - Medium</option>
                  <option value="4">4 - Large</option>
                  <option value="5">5 - Very Large</option>
                </Select>
                <FormErrorMessage>{errors.size}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            {/* Runway Information */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
              <FormControl isInvalid={errors.longest_runway_length}>
                <FormLabel>Longest Runway Length (ft)</FormLabel>
                <Input
                  name="longest_runway_length"
                  type="number"
                  value={values.longest_runway_length}
                  onChange={handleChange}
                  min="0"
                />
                <FormErrorMessage>
                  {errors.longest_runway_length}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.longest_runway_width}>
                <FormLabel>Longest Runway Width (ft)</FormLabel>
                <Input
                  name="longest_runway_width"
                  type="number"
                  value={values.longest_runway_width}
                  onChange={handleChange}
                  min="0"
                />
                <FormErrorMessage>
                  {errors.longest_runway_width}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.longest_runway_surface}>
                <FormLabel>Runway Surface</FormLabel>
                <Select
                  name="longest_runway_surface"
                  value={values.longest_runway_surface}
                  onChange={handleChange}
                  placeholder="Select Surface"
                >
                  {Object.entries(runwaySurfaces).map(([code, surface]) => (
                    <option key={code} value={code}>
                      {surface}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.longest_runway_surface}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            {/* Checkboxes */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
              <FormControl>
                <Checkbox
                  name="has_avgas"
                  isChecked={values.has_avgas}
                  onChange={handleChange}
                >
                  Has AVGAS
                </Checkbox>
              </FormControl>

              <FormControl>
                <Checkbox
                  name="has_jetfuel"
                  isChecked={values.has_jetfuel}
                  onChange={handleChange}
                >
                  Has Jet Fuel
                </Checkbox>
              </FormControl>
            </SimpleGrid>

            {/* Submit Button */}
            <Flex justifyContent="flex-end" gap={4}>
              <Button as={Link} href="/admin/airports" variant="outline">
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={processing}
                loadingText="Saving..."
              >
                {isEdit ? 'Update Airport' : 'Create Airport'}
              </Button>
            </Flex>
          </form>
        </CardBody>
      </Card>
    </AdminLayout>
  )
}

export default AirportEdit
