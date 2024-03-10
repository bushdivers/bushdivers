import { describe, expect, it } from 'vitest'

import { displayNumber } from '../../../helpers/number.helpers.js'

describe('Number display formatting', () => {
  it('returns integer in correct formatting', () => {
    const number = 100
    expect(displayNumber(number, false)).toEqual('100')
  })
  it('returns integer (thousands) in correct formatting', () => {
    const number = 1000
    expect(displayNumber(number, false)).toEqual('1,000')
  })
  it('returns decimal in correct formatting', () => {
    const number = 100.254
    expect(displayNumber(number, true)).toEqual('100.25')
  })
  it('returns decimal in correct formatting', () => {
    const number = 1000.254
    expect(displayNumber(number, true)).toEqual('1,000.25')
  })
})
