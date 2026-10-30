import { useAtomValue } from 'jotai'
import React, { useEffect } from 'react'
import { Layer, Source, useMap } from 'react-map-gl/maplibre'

import { selectedContractAtom } from '../../state/contract.state.js'
import { contractMapLayersAtom } from '../../state/map.state.js'

const ContractRoute = ({ routeData, airport }) => {
  const { current: map } = useMap()
  const contractMapLayers = useAtomValue(contractMapLayersAtom)
  const selectedContract = useAtomValue(selectedContractAtom)

  useEffect(() => {
    if (selectedContract !== null) {
      const west = Math.min(selectedContract.dep_airport.lon, selectedContract.arr_airport.lon)
      const east = Math.max(selectedContract.dep_airport.lon, selectedContract.arr_airport.lon)
      const south = Math.min(selectedContract.dep_airport.lat, selectedContract.arr_airport.lat)
      const north = Math.max(selectedContract.dep_airport.lat, selectedContract.arr_airport.lat)

      map.fitBounds([
        [west, south],
        [east, north]
      ], {
        padding: { top: 100, bottom: 100, right: 100, left: 400 },
        absolutePadding: true
      })
    } else {
      map.flyTo({ center: [airport.lon, airport.lat], zoom: 7 })
    }
  }, [routeData, selectedContract])
  return (
    <>
      {contractMapLayers.contracts && selectedContract && routeData && (
        <Source id="route-data" type="geojson" data={routeData}>
          <Layer
            id="selected-route-layer"
            type="line"
            source="route-data"
            layout={{
              'line-join': 'round',
              'line-cap': 'round',
            }}
            paint={{
              'line-color': '#48BB78',
              'line-width': 1,
            }}
          />
        </Source>
      )}
    </>
  )
}

export default ContractRoute
