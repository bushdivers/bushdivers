import React, { useEffect } from 'react'
import { Layer, Source, useMap } from 'react-map-gl'

const ContractRoute = ({ routeData, currentViews, selectedContract }) => {
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

export default ContractRoute
