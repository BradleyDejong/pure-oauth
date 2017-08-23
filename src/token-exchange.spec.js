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
        resolve({
          body: {
            access_token: 'fake-token',
            token_type: 'Bearer',
            expires_in: 123,
            scope: 'scope1 scope2 scope3',
            refresh_token: 'fake-refresh-token'
          }
        })
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

  test('response parsing', async () => {
    const response = await exchangeToken('client-id', 'redirect-here', 'token-uri', 'abc123')
      .run().promise()

    expect(response).toEqual({
      access_token: 'fake-token',
      token_type: 'Bearer',
      expires_in: 123,
      scope: 'scope1 scope2 scope3',
      refresh_token: 'fake-refresh-token'
    })
  })

  test('passes through error to response', async () => {
    superagent.send = jest.fn(function (args) {
      return new Promise(function (resolve, reject) {
        reject(new Error('test error!'))
      })
    })

    try {
      await exchangeToken('client-id', 'redirect-here', 'token-uri', 'abc123')
        .run().promise()
    } catch (e) {
      expect(e.message).toBe('test error!')
    }
  })
})
