import { afterEach, describe, expect, it } from 'vitest'
import { clearAccessToken, getAccessToken, setAccessToken } from './auth'

describe('auth token storage', () => {
  afterEach(() => {
    clearAccessToken()
  })

  it('stores and reads access token', () => {
    setAccessToken('abc-123')
    expect(getAccessToken()).toBe('abc-123')
  })

  it('clears access token', () => {
    setAccessToken('abc-123')
    clearAccessToken()
    expect(getAccessToken()).toBeNull()
  })
})
