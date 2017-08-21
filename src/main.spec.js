/* eslint-env jest */

import {task} from 'folktale/concurrency/task'
import {set, lensProp, compose} from 'ramda'

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

const MOCK_APP = 'fake-app'

const deleteClientId = set(lensProp('client_id'), '')
const deleteRedirectUri = set(lensProp('redirect_uri'), '')
const deleteResponseType = set(lensProp('response_type'), '')
const deleteState = set(lensProp('state'), '')

const clientId = set(lensProp('client_id'), 'client-id')
const redirectUri = set(lensProp('redirect_uri'), 'redirect-uri')
const responseType = set(lensProp('response_type'), 'code')
const addState = set(lensProp('state'), 'mock-state')

const VALID_PARAMS = compose(clientId, redirectUri, responseType, addState)({})

describe('authorize', () => {
  test('creates and stores state at beginning of launch flow', async () => {
    const MOCKED_STATE = 5
    require('./random').__setFakeRandom(MOCKED_STATE)

    await authorize(MOCK_APP, 'test123', VALID_PARAMS).run().promise()

    expect(store.set.mock.calls[0]).toEqual([MOCK_APP, 'state', MOCKED_STATE])
  })

  test('requires client_id', async (done) => {
    try {
      await authorize(MOCK_APP, 'mock-auth-url', deleteClientId(VALID_PARAMS)).run().promise()
    } catch (e) {
      expect(e).toBe('client_id is required')
      done()
    }
  })

  test('requires redirect_uri', async (done) => {
    try {
      await authorize(MOCK_APP, 'mock-auth-url', deleteRedirectUri(VALID_PARAMS)).run().promise()
    } catch (e) {
      expect(e).toBe('redirect_uri is required')
      done()
    }
  })

  test('requires response_type===code', async (done) => {
    try {
      await authorize(MOCK_APP, 'mock-auth-url', deleteResponseType(VALID_PARAMS)).run().promise()
    } catch (e) {
      expect(e).toBe('response_type is required')
      done()
    }
  })

  test('requires state', async (done) => {
    try {
      await authorize(MOCK_APP, 'mock-auth-url', deleteState(VALID_PARAMS)).run().promise()
    } catch (e) {
      expect(e).toBe('state is required')
      done()
    }
  })

  test('redirects to authorize_uri', async () => {
    await authorize(MOCK_APP, 'mock-auth-url', VALID_PARAMS).run().promise()
    expect(require('./location').__current()).toBe('mock-auth-url')
  })
})
