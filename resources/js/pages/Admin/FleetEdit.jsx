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
  Heading,
  Image,
  Input,
  Link,
  Select,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

import AdminUpload from '../../components/admin/AdminUpload.jsx'
import AdminLayout from '../../components/layout/AdminLayout.jsx'
import { displayFileSize } from '../../helpers/generic.helpers.js'

const FleetEdit = ({ fleet, manufacturers }) => {
  console.log(fleet?.can_purchase_new)
  const { errors } = usePage().props
  const [values, setValues] = useState({
    type: fleet?.type,
    name: fleet?.name ?? '',
    manufacturer: fleet?.manufacturer.name ?? '',
    manufacturer_id: fleet?.manufacturer_id ?? '0',
    powerplants: fleet?.powerplants ?? '',
    engines: fleet?.number_of_engines ?? '',
    tbo_mins: fleet?.tbo_mins ?? '0',
    fuel: fleet?.fuel_type ?? '1',
    zfw: fleet?.zfw ?? '',
    mtow: fleet?.mtow ?? '',
    cargo: fleet?.cargo_capacity ?? '',
    pax: fleet?.pax_capacity ?? '',
    fuelCapacity: fleet?.fuel_capacity ?? '',
    ceiling: fleet?.service_ceiling ?? '',
    range: fleet?.range ?? '',
    cruise: fleet?.cruise_speed ?? '',
    size: fleet?.size ?? 'S',
    company_fleet: fleet?.company_fleet ?? '0',
    is_rental: fleet?.is_rental ?? '0',
    rental_cost: fleet?.rental_cost ?? '',
    hq: fleet?.hq ?? '',
    new_price: fleet?.new_price ?? '',
    used_low_price: fleet?.used_low_price ?? '',
    used_high_price: fleet?.used_high_price ?? '',
    can_purchase_new: fleet?.can_purchase_new ?? false,
  })

  function handleChange(e) {
    const key = e.target.id
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues((values) => ({
      ...values,
      [key]: value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    router.post(
      fleet ? `/admin/fleet/edit/${fleet.id}` : '/admin/fleet/create',
      values
    )
  }

  return (
    <>
      {fleet && (
        <Card mb={2}>
          <CardBody>
            <SimpleGrid columns={2} gap={10}>
              <Box>
                <AdminUpload type="fleet" id={fleet.id} />
              </Box>
              <Box>
                <Heading mb={2} size="md">
                  Images
                </Heading>
                <Flex gap={4}>
                  <Flex direction="column" gap={1}>
                    <Heading size="sm">Fleet Image</Heading>
                    <Link href={fleet.image_url} target="_blank">
                      <Image src={fleet.image_url} width={250} />
                    </Link>
                  </Flex>
                  <Flex direction="column" gap={1}>
                    <Heading size="sm">Marketplace Image</Heading>
                    <Link href={fleet.image_url} target="_blank">
                      <Image src={fleet.rental_image} width={250} />
                    </Link>
                  </Flex>
                </Flex>
                <Box mt={2}>
                  <Heading size="md">Livery Files</Heading>
                  {fleet.uploads?.length > 0 ? (
                    fleet.uploads.map((u) => (
                      <Flex gap={2} key={u.id}>
                        <Link target="_blank" href={u.url}>
                          {u.display_name}
                        </Link>
                        <Text>{displayFileSize(u.size)}</Text>
                      </Flex>
                    ))
                  ) : (
                    <Text>No Liveries</Text>
                  )}
                </Box>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
      )}
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <SimpleGrid columns={2} gap={10}>
              <Box>
                <FormControl isInvalid={errors.type}>
                  <FormLabel htmlFor="type">ICAO type</FormLabel>
                  <Input
                    id="type"
                    value={values.type}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.type && (
                    <FormErrorMessage>{errors.type}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.name}>
                  <FormLabel htmlFor="name">Model name</FormLabel>
                  <Input
                    id="name"
                    value={values.name}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.name && (
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.manufacturer}>
                  <FormLabel htmlFor="manufacturer">Manufacturer</FormLabel>
                  <Input
                    id="manufacturer"
                    value={values.manufacturer}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.manufacturer && (
                    <FormErrorMessage>{errors.manufacturer}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.powerplants}>
                  <FormLabel htmlFor="powerplants">Engine type</FormLabel>
                  <Input
                    id="powerplants"
                    value={values.powerplants}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.powerplants && (
                    <FormErrorMessage>{errors.powerplants}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.engines}>
                  <FormLabel htmlFor="engines">Number of engines</FormLabel>
                  <Input
                    id="engines"
                    value={values.engines}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.engines && (
                    <FormErrorMessage>{errors.engines}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="fuel">Fuel type</FormLabel>
                  <Select id="fuel" value={values.fuel} onChange={handleChange}>
                    <option value="1">Avgas (100LL)</option>
                    <option value="2">Jet Fuel</option>
                  </Select>
                </FormControl>
                <FormControl isInvalid={errors.tbo_mins}>
                  <FormLabel htmlFor="tbo_mins">TBO (minutes)</FormLabel>
                  <Input
                    id="tbo_mins"
                    value={values.tbo_mins}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.tbo_mins && (
                    <FormErrorMessage>{errors.tbo_mins}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.zfw}>
                  <FormLabel htmlFor="zfw">
                    Zero fuel weight / empty weight (lbs)
                  </FormLabel>
                  <Input
                    id="zfw"
                    value={values.zfw}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.zfw && (
                    <FormErrorMessage>{errors.zfw}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.mtow}>
                  <FormLabel htmlFor="mtow">MTOW (lbs)</FormLabel>
                  <Input
                    id="mtow"
                    value={values.mtow}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.mtow && (
                    <FormErrorMessage>{errors.mtow}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.cargo}>
                  <FormLabel htmlFor="cargo">Cargo capacity (lbs)</FormLabel>
                  <Input
                    id="cargo"
                    value={values.cargo}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.cargo && (
                    <FormErrorMessage>{errors.cargo}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.pax}>
                  <FormLabel htmlFor="pax">Passenger capacity</FormLabel>
                  <Input
                    id="pax"
                    value={values.pax}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.pax && (
                    <FormErrorMessage>{errors.pax}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.fuelCapacity}>
                  <FormLabel htmlFor="fuelCapacity">
                    Fuel capacity (gal)
                  </FormLabel>
                  <Input
                    id="fuelCapacity"
                    value={values.fuelCapacity}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.fuelCapacity && (
                    <FormErrorMessage>{errors.fuelCapacity}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.ceiling}>
                  <FormLabel htmlFor="ceiling">Service ceiling (ft)</FormLabel>
                  <Input
                    id="ceiling"
                    value={values.ceiling}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.ceiling && (
                    <FormErrorMessage>{errors.ceiling}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.range}>
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
                <FormControl isInvalid={errors.cruise}>
                  <FormLabel htmlFor="cruise">Cruise speed (kts)</FormLabel>
                  <Input
                    id="cruise"
                    value={values.cruise}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.cruise && (
                    <FormErrorMessage>{errors.cruise}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="size">Size</FormLabel>
                  <Select id="size" value={values.size} onChange={handleChange}>
                    <option value="S">Small</option>
                    <option value="M">Medium</option>
                    <option value="L">Large</option>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <FormControl>
                  <FormLabel htmlFor="company_fleet">
                    Is company fleet?
                  </FormLabel>
                  <Select
                    id="company_fleet"
                    value={values.company_fleet}
                    onChange={handleChange}
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="is_rental">Can private rent?</FormLabel>
                  <Select
                    id="is_rental"
                    value={values.is_rental}
                    onChange={handleChange}
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="manufacturer_id">Manufacturer</FormLabel>
                  <Select
                    id="manufacturer_id"
                    value={values.manufacturer_id}
                    onChange={handleChange}
                  >
                    <option value="0">(no private ownership)</option>
                    {manufacturers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isInvalid={errors.rental_cost}>
                  <FormLabel htmlFor="rental_cost">
                    Rental cost (per hour)
                  </FormLabel>
                  <Input
                    id="rental_cost"
                    value={values.rental_cost}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.rental_cost && (
                    <FormErrorMessage>{errors.rental_cost}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.hq}>
                  <FormLabel htmlFor="hq">HQ</FormLabel>
                  <Input
                    id="hq"
                    value={values.hq}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.hq && (
                    <FormErrorMessage>{errors.hq}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.new_price}>
                  <FormLabel htmlFor="new_price">New price</FormLabel>
                  <Input
                    id="new_price"
                    value={values.new_price}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.new_price && (
                    <FormErrorMessage>{errors.new_price}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.used_low_price}>
                  <FormLabel htmlFor="used_low_price">Used low price</FormLabel>
                  <Input
                    id="used_low_price"
                    value={values.used_low_price}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.used_low_price && (
                    <FormErrorMessage>{errors.used_low_price}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.used_high_price}>
                  <FormLabel htmlFor="used_high_price">
                    Used high price
                  </FormLabel>
                  <Input
                    id="used_high_price"
                    value={values.used_high_price}
                    onChange={handleChange}
                    type="text"
                  />
                  {errors.used_high_price && (
                    <FormErrorMessage>
                      {errors.used_high_price}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <Checkbox
                  id="can_purchase_new"
                  value={values.can_purchase_new}
                  defaultChecked={values.can_purchase_new}
                  my={2}
                  onChange={handleChange}
                >
                  Can purchase new?
                </Checkbox>
              </Box>
            </SimpleGrid>
            <Flex justifyContent="right">
              <Button type="submit">Save Fleet</Button>
            </Flex>
          </form>
        </CardBody>
      </Card>
    </>
  )
}

FleetEdit.layout = (page) => (
  <AdminLayout
    children={page}
    title="Admin - Edit Fleet"
    heading="Edit Fleet"
  />
)

export default FleetEdit
