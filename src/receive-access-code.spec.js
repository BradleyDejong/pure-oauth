/* eslint-env jest */

jest.mock('./location')
const location = require('./location')

/* eslint-disable */
import {currentCode, currentState} from './receive-access-code'
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
})
