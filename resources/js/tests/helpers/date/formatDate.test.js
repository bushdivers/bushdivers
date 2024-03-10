import { describe, expect, it } from 'vitest'

import { formatDate } from '../../../helpers/date.helpers.js'

describe('Date format', () => {
  it('returns date in correct MMM dd, YYYY format', () => {
    const dateString = new Date('2023-10-05T14:48:00.000Z')
    expect(formatDate(dateString)).toEqual('Oct 05, 2023')
  })
})
