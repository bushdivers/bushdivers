import { describe, expect, it } from 'vitest'

import { parseMapStyle } from '../../../helpers/geo.helpers.js'

describe('Parse map string style', () => {
  it('returns correct dark map style string', () => {
    expect(parseMapStyle('dark')).toEqual('mapbox://styles/mapbox/dark-v10')
  })
  it('returns correct light map style string', () => {
    expect(parseMapStyle('light')).toEqual('mapbox://styles/mapbox/light-v10')
  })
  it('returns correct satellite map style string', () => {
    expect(parseMapStyle('satellite')).toEqual(
      'mapbox://styles/mapbox/satellite-streets-v11'
    )
  })
})
