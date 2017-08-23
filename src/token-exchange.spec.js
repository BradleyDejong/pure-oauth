/* eslint-env jest */

import {exchangeToken} from './token-exchange'

jest.mock('superagent', () => {
  const obj = {
    post: jest.fn(function (...args) {
      obj.__call = [...args]
      return obj
    }),
    type: jest.fn(function (t) {
      obj.__type = t
      return obj
    }),
    send: jest.fn(function (args) {
      obj.__parameters = args
      return new Promise(function (resolve, reject) {
        resolve('done')
      })
    })
  }

  return obj
})

const superagent = require('superagent')

describe('token exchange', () => {
  test('it calls superagent with code given', async () => {
    await exchangeToken('client-id', 'redirect-here', 'token-uri', 'abc123')
      .run().promise()

    expect(superagent.__call).toEqual(['token-uri'])
    expect(superagent.__parameters).toEqual({
      grant_type: 'authorization_code',
      code: 'abc123',
      client_id: 'client-id',
      redirect_uri: 'redirect-here'
    })

    expect(superagent.__type).toBe('form')
  })
})
