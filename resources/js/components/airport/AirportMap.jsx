import { Box, Image, Tag, Text, useColorMode } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import maplibre from 'maplibre-gl'
import React, { useEffect, useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'

import {
  mapboxToken,
  parseMapStyle,
  transformRequest,
} from '../../helpers/geo.helpers'
import { contractFiltersAtom } from '../../state/contract.state.js'
import {
  contractMapLayersAtom,
  contractMapStyleAtom,
} from '../../state/map.state.js'
import AircraftList from './AircraftList.jsx'
import AirportSummary from './AirportSummary.jsx'
import ContractList from './ContractList.jsx'
import ContractRoute from './ContractRoute.jsx'
import DetailsContainer from './DetailsContainer.jsx'
import PanelContainer from './panels/PanelContainer.jsx'

function AirportMap({ airport, fleet, aircraft, contracts, metar, fuel }) {
  const { colorMode } = useColorMode()
  const [routeData, setRouteData] = useState(null)
  const [selectedContract, setSelectedContract] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [selectedAircraft, setSelectedAircraft] = useState(null)
  const filters = useAtomValue(contractFiltersAtom)
  const contractMapLayers = useAtomValue(contractMapLayersAtom)
  const contractMapStyle = useAtomValue(contractMapStyleAtom)
  const [filteredContracts, setFilteredContracts] = useState(contracts)

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
        mapStyle={parseMapStyle(
          contractMapStyle === 'default' ? colorMode : contractMapStyle
        )}
        transformRequest={transformRequest}
      >
        {contractMapLayers.contracts &&
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
          selectedContract={selectedContract}
          airport={airport}
        />
        <Marker
          latitude={airport.lat}
          longitude={airport.lon}
          color="#F97316"
        />
        {contractMapLayers.fleet &&
          fleet &&
          fleet.map((ac) => (
            <Marker
              onClick={() => handleAircraftSelection(ac)}
              key={ac.id}
              scale={0.75}
              longitude={ac.last_lon}
              latitude={ac.last_lat}
            >
              <Image
                boxSize="30px"
                src="https://d1z4ruc262gung.cloudfront.net/assets/bd_flight_white.png"
              />
            </Marker>
          ))}
        {contractMapLayers.myAircraft &&
          aircraft &&
          aircraft.map((ac) => (
            <Marker
              onClick={() => handleAircraftSelection(ac)}
              key={ac.id}
              scale={0.75}
              longitude={ac.last_lon}
              latitude={ac.last_lat}
            >
              <Image
                boxSize="30px"
                src="https://d1z4ruc262gung.cloudfront.net/assets/bd_flight_black.png"
              />
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
        <AirportSummary airport={airport} />
        <PanelContainer metar={metar} fuel={fuel} currentAirport={airport} />
        <DetailsContainer>
          {contractMapLayers.contracts && contracts.length > 0 && (
            <ContractList
              selectedContract={selectedContract}
              contracts={filteredContracts}
              icao={airport.identifier}
              updateSelectedContract={updateSelectedContract}
            />
          )}
          {!contractMapLayers.myAircraft && contractMapLayers.fleet && (
            <AircraftList airport={airport} fleet={fleet} />
          )}
          {contractMapLayers.myAircraft && !contractMapLayers.fleet && (
            <AircraftList airport={airport} aircraft={aircraft} />
          )}
          {contractMapLayers.myAircraft && contractMapLayers.fleet && (
            <AircraftList airport={airport} fleet={fleet} aircraft={aircraft} />
          )}
        </DetailsContainer>
      </Map>
    </Box>
  )
}

export default AirportMap
