import { Card, CardBody, CardHeader, Icon } from '@chakra-ui/react'
import { usePage } from '@inertiajs/react'
import { Anchor } from 'lucide-react'
import React from 'react'

import AirportMap from './AirportMap'

const AirportInfo = ({ airport, metar }) => {
  const { auth } = usePage().props

  const renderRunwayText = (surface) => {
    switch (surface) {
      case 'A':
        return 'Asphalt'
      case 'B':
        return 'Bituminous'
      case 'C':
        return 'Concrete'
      case 'CE':
        return 'Cement'
      case 'CR':
        return 'Water'
      case 'G':
        return 'Grass'
      case 'GR':
        return 'Gravel'
      case 'M':
        return 'Macadam'
      case 'S':
        return 'Sand'
      case 'T':
        return 'Tarmac'
      case 'W':
        return 'Water'
      default:
        return 'Unknown'
    }
  }

  return (
    <div>
      {airport && (
        <div className="flex flex-col lg:flex-row justify-between">
          <div className="lg:w-1/2">
            <div className="mt-2 mx-2">
              <Card>
                <CardHeader>Airport Info</CardHeader>
                <CardBody>
                  <div className="flex justify-between overflow-x-auto">
                    <div className="flex flex-col items-center my-2 mx-4">
                      <div className="text-sm">ICAO</div>
                      <div className="text-xl">
                        {airport.identifier}{' '}
                        {airport.longest_runway_surface === 'W' && (
                          <Icon as={Anchor} />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center my-2 mx-4">
                      <div className="text-sm">Size</div>
                      <div className="text-xl">{airport.size}</div>
                    </div>
                    <div className="flex flex-col items-center my-2 mx-4">
                      <div className="text-sm">Country</div>
                      <div className="text-xl">{airport.country}</div>
                    </div>
                    <div className="flex flex-col items-center my-2 mx-4">
                      <div className="text-sm">Latitude</div>
                      <div className="text-xl">
                        {(airport.lat * 1).toFixed(4)}
                      </div>
                    </div>
                    <div className="flex flex-col items-center my-2 mx-4">
                      <div className="text-sm">Longitude</div>
                      <div className="text-xl">
                        {(airport.lon * 1).toFixed(4)}
                      </div>
                    </div>
                    <div className="flex flex-col items-center my-2 mx-4">
                      <div className="text-sm">Altitude</div>
                      <div className="text-xl">
                        {airport.altitude.toLocaleString(navigator.language)}ft
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
            {airport.longest_runway_length && (
              <div className="mt-2 mx-2">
                <Card>
                  <CardHeader>Runway Info</CardHeader>
                  <CardBody>
                    <div className="flex items-center">
                      <span>
                        {renderRunwayText(airport.longest_runway_surface)}{' '}
                        {airport.longest_runway_length.toLocaleString(
                          navigator.language
                        )}
                        ft x {airport.longest_runway_width}ft
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
            <div className="mt-2 mx-2">
              <Card>
                <CardHeader>METAR</CardHeader>
                <CardBody>
                  <div className="flex items-center">
                    {metar ? (
                      <>
                        <span>{metar}</span>
                      </>
                    ) : (
                      <div>No METAR available</div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
          <div className="lg:w-1/2 mt-2 mx-2">
            <Card>
              <CardBody>
                <AirportMap
                  airport={airport}
                  size="large"
                  mapStyle={auth.user.map_style}
                />
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default AirportInfo
