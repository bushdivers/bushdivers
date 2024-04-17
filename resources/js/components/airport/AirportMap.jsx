import { Box, Tag, Text, useColorMode } from '@chakra-ui/react'
import maplibre from 'maplibre-gl'
import React, { useEffect, useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'

import {
  mapboxToken,
  parseMapStyle,
  transformRequest,
} from '../../helpers/geo.helpers'
import AirportSummary from './AirportSummary.jsx'
import ContractList from './ContractList.jsx'
import ContractRoute from './ContractRoute.jsx'
import PanelContainer from './panels/PanelContainer.jsx'

function AirportMap({ airport, aircraft, contracts, metar, fuel }) {
  const { colorMode } = useColorMode()
  const [currentViews] = useState(['contracts'])
  const [routeData, setRouteData] = useState(null)
  const [selectedContract, setSelectedContract] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [selectedAircraft, setSelectedAircraft] = useState(null)
  const [filters] = useState({
    distance: 0,
    payload: 0,
  })
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

  // const clearFilters = () => {
  //   setFilters({
  //     distance: 0,
  //     payload: 0,
  //   })
  // }

  // const updateCurrentViews = (view) => {
  //   if (currentViews.includes(view)) {
  //     const newViews = currentViews.filter((v) => !v.includes(view))
  //     setCurrentViews(newViews)
  //   } else {
  //     const newViews = [...currentViews, view]
  //     setCurrentViews(newViews)
  //   }
  // }

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

  // const handleFilterChange = (e) => {
  //   const value = e.target.value
  //   const field = e.target.id
  //   setFilters({
  //     ...filters,
  //     [field]: value,
  //   })
  // }

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
        <AirportSummary airport={airport} />
        <PanelContainer metar={metar} fuel={fuel} />
        <ContractList
          currentViews={currentViews}
          selectedContract={selectedContract}
          contracts={filteredContracts}
          icao={airport.identifier}
          updateSelectedContract={updateSelectedContract}
        />
      </Map>
    </Box>
  )
}

export default AirportMap
