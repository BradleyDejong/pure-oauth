/* eslint-env jest */

jest.mock('./location')
const location = require('./location')

/* eslint-disable */
import {validateState, currentCode, currentState} from './receive-access-code'
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
      .catch((e) => {
        expect(e).toBe('must be valid-state')
        done()
      })
      .then(() => {
        throw new Error('should not succeed')
      })
  })
})
