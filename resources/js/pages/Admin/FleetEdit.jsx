import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Link,
  Select,
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
import { Link as InertiaLink, router, usePage } from '@inertiajs/react'
import { Pen, Trash2 } from 'lucide-react'
import React, { useState } from 'react'

import AdminUpload from '../../components/admin/AdminUpload.jsx'
import AdminLayout from '../../components/layout/AdminLayout.jsx'
import { displayFileSize } from '../../helpers/generic.helpers.js'

const FleetEdit = ({ fleet, manufacturers, variants }) => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    type: fleet?.type ?? '',
    name: fleet?.name ?? '',
    manufacturer: fleet?.manufacturer ?? '',
    manufacturer_id: fleet?.manufacturer_id ?? '0',
    aircraft_type: fleet?.aircraft_type ?? '',
    has_floats: fleet?.has_floats ?? false,
    powerplants: fleet?.powerplants ?? '',
    engines: fleet?.number_of_engines ?? '',
    tbo_mins: fleet?.tbo_mins ?? '0',
    fuel: fleet?.fuel_type ?? '1',
    ceiling: fleet?.service_ceiling ?? '',
    cruise: fleet?.cruise_speed ?? '',
    size: fleet?.size ?? 'S',
    company_fleet: fleet?.company_fleet ?? '0',
    is_rental: fleet?.is_rental ?? '0',
    rental_cost: fleet?.rental_cost ?? '',
    hq: fleet?.hq?.identifier ?? '',
    new_price: fleet?.new_price ?? '',
    used_low_price: fleet?.used_low_price ?? '',
    used_high_price: fleet?.used_high_price ?? '',
    can_purchase_new: fleet?.can_purchase_new ?? false,
    rental_size: fleet?.rental_size > 0,
  })

  function handleChange(e) {
    const key = e.target.id
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value

    if (key === 'fuel') {
      setValues((v) => ({ ...v, fuel: value }))
      return
    }

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
                    <Link href={fleet.rental_image} target="_blank">
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
                  <FormLabel htmlFor="manufacturer">
                    Fleet Manufacturer
                  </FormLabel>
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
                <FormControl isInvalid={errors.aircraft_type}>
                  <FormLabel htmlFor="aircraft_type">Aircraft Type</FormLabel>
                  <Flex>
                    <Select
                      id="aircraft_type"
                      value={values.aircraft_type}
                      onChange={handleChange}
                    >
                      <option value="0">Other</option>

                      <option value="1">Piston Single</option>
                      <option value="2">Piston Twin</option>
                      <option value="5">Turboprop Single</option>
                      <option value="6">Turboprop Twin</option>

                      <option value="11">Jet</option>
                      <option value="15">Heli Single</option>
                      <option value="16">Heli Twin</option>
                    </Select>
                    <Checkbox
                      id="has_floats"
                      value={values.has_floats}
                      defaultChecked={values.has_floats}
                      ml={4}
                      onChange={handleChange}
                    >
                      Has&nbsp;float option?
                    </Checkbox>
                  </Flex>
                  {errors.aircraft_type && (
                    <FormErrorMessage>{errors.aircraft_type}</FormErrorMessage>
                  )}
                </FormControl>
                <Flex gap={3}>
                  <FormControl flex={1} isInvalid={errors.engines}>
                    <FormLabel htmlFor="engines">Engines</FormLabel>
                    <InputGroup>
                      <Input
                        id="engines"
                        value={values.engines}
                        onChange={handleChange}
                        type="text"
                      />
                      <InputRightAddon>x</InputRightAddon>
                    </InputGroup>
                    {errors.engines && (
                      <FormErrorMessage>{errors.engines}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl flex={2} isInvalid={errors.powerplants}>
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
                </Flex>
                <FormControl>
                  <FormLabel htmlFor="fuel">Fuel type</FormLabel>
                  <Select id="fuel" value={values.fuel} onChange={handleChange}>
                    <option value="1">Avgas (100LL)</option>
                    <option value="2">Jet Fuel</option>
                  </Select>
                </FormControl>
                <FormControl isInvalid={errors.tbo_mins}>
                  <FormLabel htmlFor="tbo_mins">TBO (hours)</FormLabel>
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
                  <FormLabel htmlFor="manufacturer_id">
                    Marketplace Manufacturer
                  </FormLabel>
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
                <FormControl>
                  <Checkbox
                    id="can_purchase_new"
                    value={values.can_purchase_new}
                    defaultChecked={values.can_purchase_new}
                    my={2}
                    onChange={handleChange}
                  >
                    Can purchase new?
                  </Checkbox>
                </FormControl>
                <FormControl>
                  <Checkbox
                    id="rental_size"
                    value={values.rental_size}
                    defaultChecked={values.rental_size > 0}
                    my={2}
                    onChange={handleChange}
                  >
                    Rental requires large airport?
                  </Checkbox>
                </FormControl>
              </Box>
            </SimpleGrid>
            <Flex justifyContent="right">
              <Button type="submit">Save Fleet</Button>
            </Flex>
          </form>
        </CardBody>
      </Card>
      {fleet && variants !== undefined && (
        <Card mt={4}>
          <CardHeader>
            <Flex justifyContent="space-between" alignItems="center">
              <Heading size="md">Variants</Heading>
              <Button
                as={InertiaLink}
                href={`/admin/fleet/${fleet.id}/variants/create`}
                size="sm"
              >
                Add Variant
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            {variants.length === 0 ? (
              <Text color="orange.400">
                No variants configured — this fleet will be hidden from the
                marketplace and rental list until at least one variant is added.
              </Text>
            ) : (
              <TableContainer>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Default</Th>
                      <Th>PAX</Th>
                      <Th>Cargo (lbs)</Th>
                      <Th>Fuel (gal)</Th>
                      <Th>Range (nm)</Th>
                      <Th>MTOW (lbs)</Th>
                      <Th>ZFW (lbs)</Th>
                      <Th>Sim</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {variants.map((v) => (
                      <Tr key={v.id}>
                        <Td>{v.name}</Td>
                        <Td>
                          {v.is_default && (
                            <Badge colorScheme="green">Default</Badge>
                          )}
                        </Td>
                        <Td>{v.pax_capacity}</Td>
                        <Td>{v.cargo_capacity?.toLocaleString()}</Td>
                        <Td>{v.fuel_capacity}</Td>
                        <Td>{v.range?.toLocaleString()}</Td>
                        <Td>{v.mtow?.toLocaleString()}</Td>
                        <Td>{v.zfw?.toLocaleString()}</Td>
                        <Td textTransform="uppercase">
                          {v.sim_type?.length > 0
                            ? v.sim_type.join(', ')
                            : 'N/A'}
                        </Td>
                        <Td>
                          <Flex alignItems="center" gap={2}>
                            <Link
                              as={InertiaLink}
                              href={`/admin/fleet/${fleet.id}/variants/${v.id}/edit`}
                            >
                              <Button variant="ghost" size="xs">
                                <Icon as={Pen} />
                              </Button>
                            </Link>
                            {variants.length > 1 && (
                              <Link
                                as={InertiaLink}
                                href={`/admin/fleet/${fleet.id}/variants/${v.id}/delete`}
                              >
                                <Button variant="ghost" size="xs">
                                  <Icon as={Trash2} />
                                </Button>
                              </Link>
                            )}
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </CardBody>
        </Card>
      )}
    </>
  )
}

FleetEdit.layout = (page) => (
  <AdminLayout
    children={page}
    heading="Fleet Management"
    subHeading={page.props.fleet ? 'Edit existing fleet' : 'Add new fleet'}
  />
)

export default FleetEdit
