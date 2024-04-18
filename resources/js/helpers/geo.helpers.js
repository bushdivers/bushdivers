import bearing from '@turf/bearing'
import distance from '@turf/distance'
import { point } from '@turf/helpers'
import {
  isMapboxURL,
  transformMapboxUrl,
} from 'maplibregl-mapbox-request-transformer'

export const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN

export const transformRequest = (url, resourceType) => {
  if (isMapboxURL(url)) {
    return transformMapboxUrl(url, resourceType, mapboxToken)
  }
  // Do any other transforms you want
  return { url }
}

export const parseMapStyle = (mapStyle) => {
  switch (mapStyle) {
    case 'dark':
      return 'mapbox://styles/mapbox/dark-v10'
    case 'light':
      return 'mapbox://styles/mapbox/light-v10'
    case 'street':
      return 'mapbox://styles/mapbox/streets-v11'
    case 'satellite':
      return 'mapbox://styles/mapbox/satellite-streets-v11'
    case 'terrain':
      return 'mapbox://styles/mapbox/outdoors-v11'
    default:
      return 'mapbox://styles/mapbox/dark-v10'
  }
}

export const getDistance = (lat1, lon1, lat2, lon2) => {
  const start = point([lon1, lat1])
  const end = point([lon2, lat2])
  const distanceInKm = distance(start, end, { units: 'kilometers' })
  return Math.round(distanceInKm / 1.852)
}

export const getBearing = (lat1, lon1, lat2, lon2) => {
  const start = point([lon1, lat1])
  const end = point([lon2, lat2])
  return Math.round(bearing(start, end))
}
