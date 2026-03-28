import {
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react'
import { Link, router, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

import AdminLayout from '../../components/layout/AdminLayout.jsx'

const getFuelLbsPerGal = (fuelType) => (fuelType === 1 ? 5.99 : 6.79)

const toLbs = (gal, fuelType) =>
  gal === ''
    ? ''
    : String(Math.round(gal * getFuelLbsPerGal(fuelType) * 100) / 100)

const toGal = (lbs, fuelType) =>
  lbs === ''
    ? ''
    : String(Math.floor(parseFloat(lbs) / getFuelLbsPerGal(fuelType)))

const FleetVariantEdit = ({ fleet, variant }) => {
  const { errors } = usePage().props
  const fuelType = fleet.fuel_type ?? 1

  const [values, setValues] = useState({
    name: variant?.name ?? '',
    is_default: variant?.is_default ?? false,
    pax_capacity: variant?.pax_capacity ?? '',
    cargo_capacity: variant?.cargo_capacity ?? '',
    fuel_capacity: variant?.fuel_capacity ?? '',
    fuel_capacity_lbs: variant?.fuel_capacity
      ? toLbs(String(variant.fuel_capacity), fuelType)
      : '',
    range: variant?.range ?? '',
    mtow: variant?.mtow ?? '',
    zfw: variant?.zfw ?? '',
  })

  function handleChange(e) {
    const key = e.target.id
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value

    if (key === 'fuel_capacity') {
      if (!/^\d*$/.test(value)) return
      setValues((v) => ({
        ...v,
        fuel_capacity: value,
        fuel_capacity_lbs: toLbs(value, fuelType),
      }))
      return
    }

    if (key === 'fuel_capacity_lbs') {
      if (!/^\d*\.?\d*$/.test(value)) return
      setValues((v) => ({
        ...v,
        fuel_capacity_lbs: value,
        fuel_capacity: toGal(value, fuelType),
      }))
      return
    }

    setValues((v) => ({ ...v, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const url = variant
      ? `/admin/fleet/${fleet.id}/variants/${variant.id}`
      : `/admin/fleet/${fleet.id}/variants`
    router.post(url, {
      name: values.name,
      is_default: values.is_default,
      pax_capacity: values.pax_capacity,
      cargo_capacity: values.cargo_capacity,
      fuel_capacity: values.fuel_capacity,
      range: values.range,
      mtow: values.mtow,
      zfw: values.zfw,
    })
  }

  return (
    <Card>
      <CardBody>
        <Box mb={4}>
          <Button
            as={Link}
            href={`/admin/fleet/edit/${fleet.id}`}
            size="sm"
            variant="outline"
          >
            ← Back to Variants
          </Button>
        </Box>
        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={errors.name} mb={3}>
            <FormLabel htmlFor="name">Variant Name</FormLabel>
            <Input
              id="name"
              value={values.name}
              onChange={handleChange}
              type="text"
            />
            {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
          </FormControl>
          <FormControl mb={3}>
            <Checkbox
              id="is_default"
              isChecked={values.is_default}
              onChange={handleChange}
            >
              Default variant (used for fleet/marketplace display)
            </Checkbox>
          </FormControl>
          <FormControl isInvalid={errors.pax_capacity} mb={3}>
            <FormLabel htmlFor="pax_capacity">Passenger Capacity</FormLabel>
            <Input
              id="pax_capacity"
              value={values.pax_capacity}
              onChange={handleChange}
              type="text"
            />
            {errors.pax_capacity && (
              <FormErrorMessage>{errors.pax_capacity}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={errors.cargo_capacity} mb={3}>
            <FormLabel htmlFor="cargo_capacity">Cargo Capacity (lbs)</FormLabel>
            <Input
              id="cargo_capacity"
              value={values.cargo_capacity}
              onChange={handleChange}
              type="text"
            />
            {errors.cargo_capacity && (
              <FormErrorMessage>{errors.cargo_capacity}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={errors.fuel_capacity} mb={3}>
            <FormLabel htmlFor="fuel_capacity">Fuel Capacity</FormLabel>
            <Flex gap={3}>
              <InputGroup flex={1}>
                <Input
                  id="fuel_capacity"
                  value={values.fuel_capacity}
                  onChange={handleChange}
                  type="text"
                />
                <InputRightAddon>gal</InputRightAddon>
              </InputGroup>

              <InputGroup flex={1}>
                <Input
                  id="fuel_capacity_lbs"
                  value={values.fuel_capacity_lbs}
                  onChange={handleChange}
                  type="text"
                />
                <InputRightAddon>lbs</InputRightAddon>
              </InputGroup>
            </Flex>
            {errors.fuel_capacity && (
              <FormErrorMessage>{errors.fuel_capacity}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={errors.range} mb={3}>
            <FormLabel htmlFor="range">Range (nm)</FormLabel>
            <Input
              id="range"
              value={values.range}
              onChange={handleChange}
              type="text"
            />
            {errors.range && (
              <FormErrorMessage>{errors.range}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={errors.mtow} mb={3}>
            <FormLabel htmlFor="mtow">MTOW (lbs)</FormLabel>
            <Input
              id="mtow"
              value={values.mtow}
              onChange={handleChange}
              type="text"
            />
            {errors.mtow && <FormErrorMessage>{errors.mtow}</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={errors.zfw} mb={3}>
            <FormLabel htmlFor="zfw">
              Zero Fuel Weight / Empty Weight (lbs)
            </FormLabel>
            <Input
              id="zfw"
              value={values.zfw}
              onChange={handleChange}
              type="text"
            />
            {errors.zfw && <FormErrorMessage>{errors.zfw}</FormErrorMessage>}
          </FormControl>
          <Flex justifyContent="right">
            <Button type="submit">Save Variant</Button>
          </Flex>
        </form>
      </CardBody>
    </Card>
  )
}

FleetVariantEdit.layout = (page) => (
  <AdminLayout
    children={page}
    heading="Fleet Management"
    subHeading={
      page.props.variant
        ? `Edit Variant — ${page.props.variant.name}`
        : `Add Variant — ${page.props.fleet.type} ${page.props.fleet.name}`
    }
  />
)

export default FleetVariantEdit
