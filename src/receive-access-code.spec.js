/* eslint-env jest */
/* global fail */

jest.mock('./location')
const location = require('./location')

/* eslint-disable */
import {getAccessCodeAndState, validateState, currentCode, currentState} from './receive-access-code'
/* eslint-enable */

describe('receive access code', () => {
  it('parses state', async () => {
    location.__set('mock-location?state=abc123')

    const result = await currentState.run().promise()

    expect(result).toBe('abc123')
  })

  it('parses code', async () => {
    location.__set('mock-location?code=mock-code')

    const result = await currentCode.run().promise()

    expect(result).toBe('mock-code')
  })

  describe('parse and validate', () => {
    beforeEach(() => {
      const store = {
        mockApp: JSON.stringify({
          state: 'valid-state'
        })
      }
      global.sessionStorage = jest.fn()
      global.sessionStorage.getItem = jest.fn((key) => {
        return store[key]
      })
    })

    it('validates equal state', () => {
      location.__set('mock-location?state=valid-state')
      return validateState('mockApp').run().promise()
    })

    it('invalidates non-equal state', async done => {
      location.__set('mock-location?state=invalid-state')
      await validateState('mockApp').run().promise()
        .then(() => {
          fail('should fail to validate state')
        })
        .catch((e) => {
          expect(e).toBe('State validation failed')
          done()
        })
    })

    it('returns object with code and state', async () => {
      location.__set('mock-location?state=valid-state&code=wonderful-code')

      const parsedValues = await getAccessCodeAndState('mockApp').run().promise()

      expect(parsedValues).toEqual({
        state: 'valid-state',
        code: 'wonderful-code'
      })
    })

    it('fails if invalid state', async done => {
      location.__set('mock-location?state=invalid-state&code=wonderful-code')

      await getAccessCodeAndState('mockApp').run().promise()
        .then(() => fail('Should reject due to invalid state'))
        .catch(e => {
          expect(e).toBe('State validation failed')
          done()
        })
    })
  })
})
