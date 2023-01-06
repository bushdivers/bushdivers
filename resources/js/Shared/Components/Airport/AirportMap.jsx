import React, { useEffect, useState, useContext } from 'react'
import maplibre from 'maplibre-gl'
import { parseMapStyle, transformRequest } from '../../../Helpers/general.helpers'
import ThemeContext from '../../../Context/ThemeContext'
import Map, { useMap, Layer, Marker, Source, Popup } from 'react-map-gl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloud, faRoad, faFileSignature, faPlane, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import Card from '../../Elements/Card'
import Tooltip from '../../Elements/Tooltip'
import ContractDetail from '../Contracts/ContractDetail'
import AirportMetar from './AirportMetar'
import AirportRunway from './AirportRunway'
import Select from '../../Elements/Forms/Select'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Inertia } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/inertia-react'

const accessToken = import.meta.env.VITE_MAPBOX_TOKEN

function AirportInfo ({ airport, updateCurrentViews, currentViews }) {
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
    <div className="absolute z-10 w-1/2 lg:w-1/4 opacity-90 top-10 left-12 right-12">
        <div className="w-full">
          <Card slimline title={`${airport.name} - ${airport.identifier}`}>
            <div className="flex items-center space-x-4">
              <span className="w-6 h-6 p-1 flex items-center justify-center rounded-full bg-secondary text-white">{airport.size}</span>
              <span className="text-lg">{airport.altitude}ft</span>
              <span className="text-lg">Lat: {airport.lat} Lon: {airport.lon}</span>
              {airport.is_hub && <span className="badge badge-accent">hub</span>}
            </div>
            <div className="mt-2 flex space-x-1">
              <Tooltip direction="top" content="Metar"><button onClick={() => changeViews('metar')} className={`btn ${currentViews.includes('metar') ? 'btn-primary' : 'btn-secondary'} btn-sm`}><FontAwesomeIcon icon={faCloud} /></button></Tooltip>
              <Tooltip direction="top" content="Runway Info"><button onClick={() => changeViews('runway')} className={`btn ${currentViews.includes('runway') ? 'btn-primary' : 'btn-secondary'} btn-sm`}><FontAwesomeIcon icon={faRoad} /></button></Tooltip>
              <Tooltip direction="top" content="Contracts"><button onClick={() => changeViews('contracts')} className={`btn ${currentViews.includes('contracts') ? 'btn-primary' : 'btn-secondary'} btn-sm`}><FontAwesomeIcon icon={faFileSignature} /></button></Tooltip>
              <Tooltip direction="top" content="Aircraft"><button onClick={() => changeViews('aircraft')} className={`btn ${currentViews.includes('aircraft') ? 'btn-primary' : 'btn-secondary'} btn-sm`}><FontAwesomeIcon icon={faPlane} /></button></Tooltip>
            </div>
          </Card>
        </div>
      </div>
  )
}

function ContractRoute ({ routeData, currentViews, selectedContract }) {
  const { current: map } = useMap()
  useEffect(() => {
    if (selectedContract !== null) {
      const depLngLat = [selectedContract.dep_airport.lon, selectedContract.dep_airport.lat]
      const arrLngLat = [selectedContract.arr_airport.lon, selectedContract.arr_airport.lat]
      map.fitBounds([depLngLat, arrLngLat], { padding: { top: 100, bottom: 100, right: 50, left: 400 } })
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
            'line-cap': 'round'
          }}
          paint={{
            'line-color': '#F97316',
            'line-width': 1
          }}
        />
      </Source>
    )}
    </>
  )
}

function ContractList ({ icao, contracts, currentViews, selectedContract, updateSelectedContract }) {
  const { auth } = usePage().props
  async function bidForContract (contract) {
    console.log(contract)
    // await updateSelectedContract(null)
    const data = {
      id: contract.id,
      userId: auth.user.id
    }
    const bid = axios.post('/api/contracts/bid', data)
    await toast.promise(bid, {
      loading: '...Bidding on contract',
      success: 'Contract won!',
      error: 'Issue processing bid'
    }, { position: 'top-right' })
    Inertia.reload({ only: ['contracts'] })
  }
  return (
    <>
    {currentViews.includes('contracts') && contracts.length > 0 && (
      <div className="absolute z-10 bg-neutral px-4 lg:w-2/5 opacity-90 map-data bottom-4 left-12 right-12 rounded-lg shadow-lg">
        <div className="sticky top-0 bg-neutral py-2 flex justify-between items-center mb-2">
          <h4>Contracts from {icao}</h4>
        </div>
        <div className="map-data-content overflow-y-auto">
          {contracts && contracts.map((c) => (
            <ContractDetail key={c.id} contract={c} selectedContract={selectedContract} action={bidForContract} type="search" updateSelectedContract={updateSelectedContract} />
          ))}
        </div>
      </div>
    )}
    </>
  )
}

function AirportMap ({ airport, metar, aircraft, contracts, size, updatedMapStyle }) {
  const [currentViews, setCurrentViews] = useState(['contracts'])
  const { currentTheme } = useContext(ThemeContext)
  const [routeData, setRouteData] = useState(null)
  const [selectedContract, setSelectedContract] = useState(null)
  const [mapStyle, setMapStyle] = useState(currentTheme)
  const [showPopup, setShowPopup] = useState(false)
  const [selectedAircraft, setSelectedAircraft] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    distance: 0,
    payload: 0
  })
  const [filteredContracts, setFilteredContracts] = useState(contracts)

  useEffect(() => {
    setMapStyle(currentTheme)
  }, [currentTheme])

  useEffect(() => {
    if (updatedMapStyle === '') {
      setMapStyle(currentTheme)
    } else {
      setMapStyle(updatedMapStyle)
    }
  }, [updatedMapStyle])

  useEffect(() => {
    setRouteData(null)
    applyFilters()
  }, [contracts])

  useEffect(() => {
    applyFilters()
  }, [filters])

  const applyFilters = () => {
    console.log(filters)
    let distanceFiltered = null
    let newContracts = null
    switch (filters.distance) {
      case '0':
        distanceFiltered = contracts
        break
      case '60':
        distanceFiltered = contracts.filter(c => c.distance < 60)
        console.log(distanceFiltered)
        break
      case '100':
        distanceFiltered = contracts.filter(c => c.distance < 100 && c.distance >= 60)
        break
      case '300':
        distanceFiltered = contracts.filter(c => c.distance >= 100)
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
        newContracts = distanceFiltered.filter(c => c.payload < 1000)
        break
      case '3000':
        newContracts = distanceFiltered.filter(c => c.payload < 3000 && c.payload >= 1000)
        break
      case '10000':
        newContracts = distanceFiltered.filter(c => c.payload >= 3000)
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
      payload: 0
    })
  }

  const updateCurrentViews = (view) => {
    if (currentViews.includes(view)) {
      const newViews = currentViews.filter(v => !v.includes(view))
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
        coordinates: [depLngLat, arrLngLat]
      }
    }
    setRouteData(geojson)
    setSelectedContract(contract)
  }

  const handleAircraftSelection = (ac) => {
    setSelectedAircraft(ac)
    setShowPopup(true)
  }

  const handleFilterChange = (e) => {
    const value = e.target.value
    const field = e.target.id
    setFilters({
      ...filters,
      [field]: value
    })
  }

  return (
    <div className={`map-container-${size} relative`}>
      <Map
      id="airportMap"
      mapLib={maplibre}
      mapboxAccessToken={accessToken}
      initialViewState={{
        longitude: airport.lon,
        latitude: airport.lat,
        zoom: 7
      }}
      mapStyle={parseMapStyle(mapStyle)}
      transformRequest={transformRequest}
      >
        {currentViews.includes('contracts') && filteredContracts && filteredContracts.map((contract) => (
          <Marker key={contract.id} scale={0.75} longitude={contract.arr_airport.lon} latitude={contract.arr_airport.lat} onClick={() => updateSelectedContract(contract)}>
            <div className="h-10 w-10 p-2 rounded-full text-1xs bg-accent border-primary-content border text-primary-content flex justify-center items-center cursor-pointer">{contract.arr_airport.identifier}</div>
          </Marker>
        ))}
        <ContractRoute routeData={routeData} currentViews={currentViews} selectedContract={selectedContract} />
        <Marker latitude={airport.lat} longitude={airport.lon} color="#F97316" />
        {currentViews.includes('aircraft') && aircraft && aircraft.map((ac) => (
          <Marker onClick={() => handleAircraftSelection(ac)} key={ac.id} scale={0.75} longitude={ac.last_lon} latitude={ac.last_lat}>
            <img src="https://res.cloudinary.com/dji0yvkef/image/upload/v1631525263/BDVA/icon_c208_orangekFus_whiteWings_revnmm.png" />
          </Marker>
        ))}
        {showPopup && (
          <Popup longitude={selectedAircraft.last_lon} latitude={selectedAircraft.last_lat}
            anchor="bottom"
            onClose={() => setShowPopup(false)}
            closeOnClick={false}
            >
            <div>
              <p>{selectedAircraft.fleet.manufacturer} {selectedAircraft.fleet.name}</p>
              <p>{selectedAircraft.fleet.type} {selectedAircraft.registration}</p>
            </div>
          </Popup>
        )}
        <AirportInfo currentViews={currentViews} updateCurrentViews={updateCurrentViews} airport={airport} />
        {currentViews.includes('metar') && <AirportMetar metar={metar} isRunwayVisible={currentViews.includes('runway')} />}
        {currentViews.includes('runway') && <AirportRunway airport={airport} />}
        <ContractList currentViews={currentViews} selectedContract={selectedContract} contracts={filteredContracts} icao={airport.identifier} updateSelectedContract={updateSelectedContract} />
        <div className="absolute z-10 top-10 right-12">
          <button onClick={() => clearFilters()} className="btn btn-primary">Clear Filters</button>
        </div>
        {currentViews.includes('contracts') && (
        <div className="absolute z-10 top-10 right-52">
        <Card slimline>
        <div className="flex w-full flex-col items-center space-y-2">
          <div onClick={() => setShowFilters(!showFilters)} className="flex w-full items-center justify-between space-x-2 cursor-pointer">
            <h4>Filters</h4>
            <span className="p-2 cursor-pointer">
              {showFilters ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
              </span>
          </div>
          {showFilters && (
            <div className="flex flex-col">
              <div className="flex flex-col">
                <span className="text-sm">Distance</span>
                <Select value={filters.distance} onChange={handleFilterChange} id="distance" options={[
                  { value: '0', text: 'All Distances' },
                  { value: '60', text: '< 60' },
                  { value: '100', text: '60 - 100' },
                  { value: '300', text: '> 100' }
                ]} />
              </div>
            <div className="flex flex-col">
            <span className="text-sm">Payload</span>
            <Select value={filters.payload} onChange={handleFilterChange} id="payload" options={[
              { value: '0', text: 'All Payloads' },
              { value: '1000', text: '< 1000' },
              { value: '3000', text: '1000 - 3000' },
              { value: '10000', text: '> 3000' }
            ]} />
            </div>
            </div>
          )}
            </div>
          </Card>
        </div>
        )}
      </Map>
    </div>
  )
}

export default AirportMap
