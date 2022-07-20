import haversineDistance from 'haversine-distance'

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

export const formatNumber = (n) => {
  const nf = Intl.NumberFormat('en-US')
  return nf.format(Math.round(n))
}

export const getDistance = (lat1, lon1, lat2, lon2) => {
  const distanceM = haversineDistance({ latitude: lat1, longitude: lon1 }, { latitude: lat2, longitude: lon2 })
  return Math.round(distanceM / 1852)
}
