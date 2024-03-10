import { describe, expect, it } from 'vitest'

import { getDistance } from '../../../helpers/geo.helpers.js'

describe('Distance calculation using haversine', () => {
  it('returns correct distance for short distance (AYMR - AYMH)', () => {
    const data = {
      lat1: -6.363332,
      lon1: 143.238056,
      lat2: -5.826788,
      lon2: 144.295861,
    }
    expect(getDistance(data.lat1, data.lon1, data.lat2, data.lon2)).toEqual(71)
  })
  it('returns correct distance for long distance (AYPY - PAJN)', () => {
    const data = {
      lat1: -9.443382,
      lon1: 147.22005,
      lat2: 58.354712,
      lon2: -134.57847,
    }
    expect(getDistance(data.lat1, data.lon1, data.lat2, data.lon2)).toEqual(
      5520
    )
  })
})
