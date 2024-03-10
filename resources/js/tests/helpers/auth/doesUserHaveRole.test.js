import { describe, expect, it } from 'vitest'

import { doesUserHaveRole } from '../../../helpers/auth.helpers'

describe('User role check', () => {
  it('returns true if role exists', () => {
    const roleToSearch = 'fleet_admin'
    const userRoles = ['fleet_admin', 'maintenance_manager']
    expect(doesUserHaveRole(userRoles, roleToSearch)).toBeTruthy()
  })
  it('returns false if role does not exist', () => {
    const roleToSearch = 'user_admin'
    const userRoles = ['fleet_admin', 'maintenance_manager']
    expect(doesUserHaveRole(userRoles, roleToSearch)).toBeFalsy()
  })
})
