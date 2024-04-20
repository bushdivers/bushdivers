import { useAtomValue } from 'jotai'
import React, { useEffect } from 'react'
import { Layer, Source, useMap } from 'react-map-gl'

import { selectedContractAtom } from '../../state/contract.state.js'
import { contractMapLayersAtom } from '../../state/map.state.js'

const ContractRoute = ({ routeData, airport }) => {
  const { current: map } = useMap()
  const contractMapLayers = useAtomValue(contractMapLayersAtom)
  const selectedContract = useAtomValue(selectedContractAtom)

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
    } else {
      map.flyTo({ center: [airport.lon, airport.lat], zoom: 7 })
    }
  }, [routeData, selectedContract])
  return (
    <>
      {contractMapLayers.contracts && selectedContract && routeData && (
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

export default ContractRoute
