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
  const R = 6371e3 // metres
  const φ1 = (lat1 * Math.PI) / 180 // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const d = R * c // in metres
  return Math.round(d / 1852) // in nm
}

export const getBearing = (lat1, lon1, lat2, lon2) => {
  let y = Math.sin(lon2 - lon1) * Math.cos(lat2)
  let x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
  let brng = (Math.atan2(y, x) * 180) / Math.PI
  if (brng < 0) {
    brng = brng + 360
  }
  return Math.round(brng)
}
