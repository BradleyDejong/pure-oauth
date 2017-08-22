/* eslint-env jest */

import {task} from 'folktale/concurrency/task'
import {set, lensProp, compose} from 'ramda'
import url from 'url'

jest.mock('./location')
jest.mock('./random')

jest.unmock('./session-store')
const store = require('./session-store')
store.set = jest.fn((a, b, c) => {
  return task(resolver => resolver.resolve())
})

/* eslint-disable */
import { authorize } from './authorize'
/* eslint-enable */

const lenses = {
  client_id: lensProp('client_id'),
  redirect_uri: lensProp('redirect_uri'),
  response_type: lensProp('response_type'),
  state: lensProp('state')
}

const deleteClientId = set(lenses.client_id, '')
const deleteRedirectUri = set(lenses.redirect_uri, '')
const deleteResponseType = set(lenses.response_type, '')
const deleteState = set(lenses.state, '')

const clientId = set(lenses.client_id, 'fake-client-id')
const redirectUri = set(lenses.redirect_uri, 'redirect uri')
const responseType = set(lenses.response_type, 'code')
const addState = set(lenses.state, 'mock state')

const VALID_PARAMS = compose(clientId, redirectUri, responseType, addState)({})

describe('authorize', () => {
  test('creates and stores state at beginning of launch flow', async () => {
    const MOCKED_STATE = 5
    require('./random').__setFakeRandom(MOCKED_STATE)

    await authorize('test123', VALID_PARAMS).run().promise()

    expect(store.set.mock.calls[0]).toEqual(['fake-client-id', 'state', MOCKED_STATE])
  })

  test('requires client_id', async (done) => {
    try {
      await authorize('mock-auth-url', deleteClientId(VALID_PARAMS)).run().promise()
    } catch (e) {
      expect(e).toBe('client_id is required')
      done()
    }
  })

  test('requires redirect_uri', async (done) => {
    try {
      await authorize('mock-auth-url', deleteRedirectUri(VALID_PARAMS)).run().promise()
    } catch (e) {
      expect(e).toBe('redirect_uri is required')
      done()
    }
  })

  test('requires response_type===code', async (done) => {
    try {
      await authorize('mock-auth-url', set(lenses.response_type, 'not-code', VALID_PARAMS)).run().promise()
    } catch (e) {
      expect(e).toBe('response_type must be one of [\'code\', \'token\']')
      done()
    }
  })

  test('requires response_type', async (done) => {
    try {
      await authorize('mock-auth-url', deleteResponseType(VALID_PARAMS)).run().promise()
    } catch (e) {
      expect(e).toBe('response_type is required')
      done()
    }
  })

  test('requires state', async (done) => {
    try {
      await authorize('mock-auth-url', deleteState(VALID_PARAMS)).run().promise()
    } catch (e) {
      expect(e).toBe('state is required')
      done()
    }
  })

  test('redirects to authorize_uri', async () => {
    await authorize('http://mock-auth-url', VALID_PARAMS).run().promise()
    expect(require('./location').__current()).toMatch(/mock-auth-url/)
  })

  test('includes parameters', async () => {
    await authorize('mock-auth-url', VALID_PARAMS).run().promise()

    const queryParams = url.parse(require('./location').__current(), true).query
    expect(queryParams).toEqual(VALID_PARAMS)
  })
})
