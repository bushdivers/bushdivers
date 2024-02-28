import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Icon,
  Input,
  Select,
  Tag,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import axios from 'axios'
import {
  ArrowsUpFromLine,
  Cloud,
  FilePen,
  Filter,
  Plane,
  Search,
} from 'lucide-react'
import maplibre from 'maplibre-gl'
import React, { useEffect, useState } from 'react'
import Map, { Layer, Marker, Popup, Source, useMap } from 'react-map-gl'

import Tooltip from '../../components/elements/Tooltip'
import {
  mapboxToken,
  parseMapStyle,
  transformRequest,
} from '../../helpers/geo.helpers'
import ContractDetail from '../contracts/ContractDetail'
import AirportMetar from './AirportMetar'
import AirportRunway from './AirportRunway'

function renameAirport(airport) {
  const newIcao = window.prompt('Enter new ICAO code for this airport', airport)
  if (newIcao.length <= 2) return

  router.post('/airports/maintenance/rename', { airport, newIcao })
}

function AirportInfo({ airport, updateCurrentViews, currentViews }) {
  const { auth } = usePage().props
  const { current: map } = useMap()
  const changeViews = (view) => {
    if (view === 'aircraft' && !currentViews.includes('aircraft')) {
      map.flyTo({ center: [airport.lon, airport.lat], zoom: 14 })
    } else if (view === 'aircraft' && currentViews.includes('aircraft')) {
      map.flyTo({ center: [airport.lon, airport.lat], zoom: 7 })
    }
    updateCurrentViews(view)
  }

  return (
    <Box position="absolute" top={10} left={12} w={400}>
      <Card>
        <CardHeader>
          <Flex justifyContent="space-between" gap={2}>
            <Tag w={6} h={6}>
              {airport.size}
            </Tag>
            <Text fontSize="lg">{`${airport.name} - ${airport.identifier}`}</Text>
            {airport.is_hub ? <Tag>hub</Tag> : <></>}
          </Flex>
        </CardHeader>
        <CardBody>
          <Flex direction="column" gap={1}>
            <Text>{airport.altitude}ft</Text>
            <Text>
              Lat: {airport.lat} Lon: {airport.lon}
            </Text>
          </Flex>
          <Flex mt={2} gap={1}>
            <Tooltip direction="top" content="Metar">
              <Button
                onClick={() => changeViews('metar')}
                size="xs"
                variant={currentViews.includes('metar') ? 'solid' : 'ghost'}
              >
                <Icon as={Cloud} />
              </Button>
            </Tooltip>
            <Tooltip direction="top" content="Runway Info">
              <Button
                onClick={() => changeViews('runway')}
                size="xs"
                variant={currentViews.includes('runway') ? 'solid' : 'ghost'}
              >
                <Icon as={ArrowsUpFromLine} />
              </Button>
            </Tooltip>
            <Tooltip direction="top" content="Contracts">
              <Button
                onClick={() => changeViews('contracts')}
                size="xs"
                variant={currentViews.includes('contracts') ? 'solid' : 'ghost'}
              >
                <Icon as={FilePen} />
              </Button>
            </Tooltip>
            <Tooltip direction="top" content="Aircraft">
              <Button
                onClick={() => changeViews('aircraft')}
                size="xs"
                variant={currentViews.includes('aircraft') ? 'solid' : 'ghost'}
              >
                <Icon as={Plane} />
              </Button>
            </Tooltip>
            {auth.user.user_roles.includes('airport_manager') && (
              <Button
                onClick={() => renameAirport(airport.identifier)}
                size="xs"
                variant="ghost"
                colorScheme="gray"
              >
                Rename ICAO
              </Button>
            )}
          </Flex>
        </CardBody>
      </Card>
    </Box>
  )
}

function ContractRoute({ routeData, currentViews, selectedContract }) {
  const { current: map } = useMap()
  useEffect(() => {
    if (selectedContract !== null) {
      const depLngLat = [
        selectedContract.dep_airport.lon,
        selectedContract.dep_airport.lat,
      ]
      const arrLngLat = [
        selectedContract.arr_airport.lon,
        selectedContract.arr_airport.lat,
      ]
      map.fitBounds([depLngLat, arrLngLat], {
        padding: { top: 100, bottom: 100, right: 50, left: 400 },
      })
    }
  }, [routeData, selectedContract])
  return (
    <>
      {currentViews.includes('contracts') && routeData && (
        <Source id="routeData" type="geojson" data={routeData}>
          <Layer
            id="lineLayer"
            type="line"
            source="my-data"
            layout={{
              'line-join': 'round',
              'line-cap': 'round',
            }}
            paint={{
              'line-color': '#F97316',
              'line-width': 1,
            }}
          />
        </Source>
      )}
    </>
  )
}

function ContractList({
  icao,
  contracts,
  currentViews,
  selectedContract,
  updateSelectedContract,
}) {
  const { auth } = usePage().props
  async function bidForContract(contract) {
    // await updateSelectedContract(null)
    const data = {
      id: contract.id,
      userId: auth.user.id,
      action: 'bid',
    }
    await axios.post('/api/contracts/bid', data)

    router.reload({ only: ['contracts'] })
  }
  return (
    <>
      {currentViews.includes('contracts') && contracts.length > 0 && (
        <Box position="absolute" w={400} bottom={4} left={12}>
          <Card>
            <CardHeader>Contracts from {icao}</CardHeader>
            <CardBody>
              <Box overflowY="auto" className="map-data-content">
                {contracts &&
                  contracts.map((c) => (
                    <ContractDetail
                      key={c.id}
                      contract={c}
                      selectedContract={selectedContract}
                      action={bidForContract}
                      type="search"
                      updateSelectedContract={updateSelectedContract}
                    />
                  ))}
              </Box>
            </CardBody>
          </Card>
        </Box>
      )}
    </>
  )
}

function AirportMap({ airport, metar, metarLoading, aircraft, contracts }) {
  const { colorMode } = useColorMode()
  const [currentViews, setCurrentViews] = useState(['contracts'])
  const [routeData, setRouteData] = useState(null)
  const [selectedContract, setSelectedContract] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [selectedAircraft, setSelectedAircraft] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    distance: 0,
    payload: 0,
  })
  const [filteredContracts, setFilteredContracts] = useState(contracts)
  const [airportSearch, setAirportSearch] = useState('')

  useEffect(() => {
    setRouteData(null)
    applyFilters()
  }, [contracts])

  useEffect(() => {
    applyFilters()
  }, [filters])

  const applyFilters = () => {
    let distanceFiltered = null
    let newContracts = null
    switch (filters.distance) {
      case '0':
        distanceFiltered = contracts
        break
      case '60':
        distanceFiltered = contracts.filter((c) => c.distance < 60)
        break
      case '100':
        distanceFiltered = contracts.filter(
          (c) => c.distance < 100 && c.distance >= 60
        )
        break
      case '300':
        distanceFiltered = contracts.filter((c) => c.distance >= 100)
        break
      default:
        distanceFiltered = contracts
        break
    }
    switch (filters.payload) {
      case '0':
        newContracts = distanceFiltered
        break
      case '1000':
        newContracts = distanceFiltered.filter((c) => c.payload < 1000)
        break
      case '3000':
        newContracts = distanceFiltered.filter(
          (c) => c.payload < 3000 && c.payload >= 1000
        )
        break
      case '10000':
        newContracts = distanceFiltered.filter((c) => c.payload >= 3000)
        break
      default:
        newContracts = distanceFiltered
        break
    }
    // console.log(newContracts)
    setFilteredContracts(newContracts)
  }

  const clearFilters = () => {
    setFilters({
      distance: 0,
      payload: 0,
    })
  }

  const updateCurrentViews = (view) => {
    if (currentViews.includes(view)) {
      const newViews = currentViews.filter((v) => !v.includes(view))
      setCurrentViews(newViews)
    } else {
      const newViews = [...currentViews, view]
      setCurrentViews(newViews)
    }
  }

  const updateSelectedContract = (contract) => {
    setSelectedContract(null)
    const depLngLat = [contract.dep_airport.lon, contract.dep_airport.lat]
    const arrLngLat = [contract.arr_airport.lon, contract.arr_airport.lat]
    const geojson = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [depLngLat, arrLngLat],
      },
    }
    setRouteData(geojson)
    setSelectedContract(contract)
  }

  const handleAircraftSelection = (ac) => {
    setSelectedAircraft(ac)
    setShowPopup(true)
  }

  const handleSearchChange = (e) => {
    setAirportSearch(e.target.value)
  }

  const handleAirportSearch = () => {
    if (airportSearch !== '') {
      router.get(`/airports/${airportSearch}`)
    }
  }

  const handleFilterChange = (e) => {
    const value = e.target.value
    const field = e.target.id
    setFilters({
      ...filters,
      [field]: value,
    })
  }

  return (
    <Box position="relative" className="map-container-full">
      <Map
        id="airportMap"
        mapLib={maplibre}
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: airport.lon,
          latitude: airport.lat,
          zoom: 7,
        }}
        mapStyle={parseMapStyle(colorMode)}
        transformRequest={transformRequest}
      >
        {currentViews.includes('contracts') &&
          filteredContracts &&
          filteredContracts.map((contract) => (
            <Marker
              key={contract.id}
              scale={0.75}
              longitude={contract.arr_airport.lon}
              latitude={contract.arr_airport.lat}
              onClick={() => updateSelectedContract(contract)}
            >
              <Tag cursor="pointer">{contract.arr_airport.identifier}</Tag>
            </Marker>
          ))}
        <ContractRoute
          routeData={routeData}
          currentViews={currentViews}
          selectedContract={selectedContract}
        />
        <Marker
          latitude={airport.lat}
          longitude={airport.lon}
          color="#F97316"
        />
        {currentViews.includes('aircraft') &&
          aircraft &&
          aircraft.map((ac) => (
            <Marker
              onClick={() => handleAircraftSelection(ac)}
              key={ac.id}
              scale={0.75}
              longitude={ac.last_lon}
              latitude={ac.last_lat}
            >
              <img src="https://res.cloudinary.com/dji0yvkef/image/upload/v1631525263/BDVA/icon_c208_orangekFus_whiteWings_revnmm.png" />
            </Marker>
          ))}
        {showPopup && (
          <Popup
            longitude={selectedAircraft.last_lon}
            latitude={selectedAircraft.last_lat}
            anchor="bottom"
            onClose={() => setShowPopup(false)}
            closeOnClick={false}
          >
            <Box>
              <Text color="gray.800">
                {selectedAircraft.fleet.manufacturer}{' '}
                {selectedAircraft.fleet.name}
              </Text>
              <Text color="gray.800">
                {selectedAircraft.fleet.type} {selectedAircraft.registration}
              </Text>
            </Box>
          </Popup>
        )}
        <AirportInfo
          currentViews={currentViews}
          updateCurrentViews={updateCurrentViews}
          airport={airport}
        />
        {currentViews.includes('metar') && (
          <AirportMetar
            metar={metar}
            loading={metarLoading}
            isRunwayVisible={currentViews.includes('runway')}
          />
        )}
        {currentViews.includes('runway') && <AirportRunway airport={airport} />}
        <ContractList
          currentViews={currentViews}
          selectedContract={selectedContract}
          contracts={filteredContracts}
          icao={airport.identifier}
          updateSelectedContract={updateSelectedContract}
        />
        <Flex gap={2} position="absolute" top={10} right={12}>
          {currentViews.includes('contracts') && (
            <Flex direction="column">
              <Flex justifyContent="end">
                <Button size="sm" onClick={() => setShowFilters(!showFilters)}>
                  <Icon as={Filter} />
                </Button>
              </Flex>
              <Box mt={2}>
                {showFilters && (
                  <Card>
                    <CardBody>
                      <Flex direction="column">
                        <Flex direction="column" gap={1}>
                          <Text fontSize="sm">Distance</Text>
                          <Select
                            value={filters.distance}
                            onChange={handleFilterChange}
                            id="distance"
                          >
                            <option value="0">All</option>
                            <option value="60">{'< 60'}</option>
                            <option value="100">60 - 100</option>
                            <option value="300">{'> '} 100</option>
                          </Select>
                        </Flex>
                        <Flex direction="column" gap={1}>
                          <Text fontSize="sm">Payload</Text>
                          <Select
                            value={filters.payload}
                            onChange={handleFilterChange}
                            id="payload"
                          >
                            <option value="0">All</option>
                            <option value="1000">{'< 1000'}</option>
                            <option value="3000">1000 - 3000</option>
                            <option value="10000">{'> '} 3000</option>
                          </Select>
                        </Flex>
                      </Flex>
                    </CardBody>
                  </Card>
                )}
              </Box>
            </Flex>
          )}
          <Box>
            <Button size="sm" onClick={() => clearFilters()}>
              Clear Filters
            </Button>
          </Box>
          <Flex gap={1} ml={4}>
            <Input
              value={airportSearch}
              onChange={handleSearchChange}
              placeholder="Search ICAO"
              size="sm"
              type="text"
              bgColor={useColorModeValue('white', 'gray.800')}
            />
            <Button
              size="sm"
              onClick={() => handleAirportSearch(airportSearch)}
            >
              <Icon as={Search} />
            </Button>
          </Flex>
        </Flex>
      </Map>
    </Box>
  )
}

export default AirportMap
