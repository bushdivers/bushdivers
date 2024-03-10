import { describe, expect, it } from 'vitest'

import { convertMinuteDecimalToHoursAndMinutes } from '../../../helpers/date.helpers.js'

describe('Minute to time conversion', () => {
  it('returns correct hh:mm format for minute integer', () => {
    const decimalTime = 62
    expect(convertMinuteDecimalToHoursAndMinutes(decimalTime)).toEqual('1:02')
  })
})
