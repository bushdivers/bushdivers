import haversineDistance from 'haversine-distance'
import { isMapboxURL, transformMapboxUrl } from 'maplibregl-mapbox-request-transformer'

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

export const capitalize = s => (s && s[0].toUpperCase() + s.slice(1)) || ''

export const displayNumber = (n, decimal = true) => decimal ? parseFloat(n).toLocaleString(undefined, { maximumFractionDigits: 2 }) : parseInt(n).toLocaleString()

export const getDistance = (lat1, lon1, lat2, lon2) => {
  const distanceM = haversineDistance({ latitude: lat1, longitude: lon1 }, { latitude: lat2, longitude: lon2 })
  return Math.round(distanceM / 1852)
}

export function dynamicSort (property, direction) {
  const sortOrder = direction === 'asc' ? 1 : -1
  return function (a, b) {
    const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0
    return result * sortOrder
  }
}
