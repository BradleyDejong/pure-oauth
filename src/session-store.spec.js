import {appStorage, get as oldGet, set as oldSet} from './session-store'

/* eslint-env jest */

const MOCK_APP = 'fake-app'

const set = oldSet(MOCK_APP)
const get = oldGet(MOCK_APP)

describe('session store', () => {
  beforeEach(() => {
    const store = {}
    global.sessionStorage = jest.fn()
    global.sessionStorage.setItem = jest.fn((key, val) => {
      store[key] = val
    })
    global.sessionStorage.getItem = jest.fn((key) => store[key])
  })

  describe('setting values', () => {
    test('session store basic', () => {
      const io = set('test prop', 'test value')
      io.run()
      expect(global.sessionStorage.setItem.mock.calls)
        .toEqual([
          ['fake-app', '{"test prop":"test value"}']
        ])
    })

    test('session store with existing value', async () => {
      await set('test prop', 'test value')
        .chain(() => set('test prop 2', 'test val 2'))
        .run().promise()

      expect(global.sessionStorage.setItem.mock.calls[1])
        .toEqual(
          ['fake-app', '{"test prop":"test value","test prop 2":"test val 2"}'])
    })

    test('set returns value given', async () => {
      const result = await set('test prop', 'test value')
        .run().promise()

      expect(result).toBe('test value')
    })
  })

  describe('app storage', () => {
    test('default is empty object string', async () => {
      const result = await appStorage('fake-app-123')
        .run()
        .promise()

      expect(result).toEqual({})
    })

    test('returns value after setting', async () => {
      const result = await set('k1', 'v1')
        .chain(() => set('k2', 'v2'))
        .run().promise()

      expect(result).toEqual('v2')
    })

    test('returns all keys placed so far', async () => {
      await set('k1', 'v1')
        .chain(() => set('k2', 'v2'))
        .run().promise()

      const result = await appStorage(MOCK_APP)
        .run()
        .promise()

      expect(result).toEqual({
        k1: 'v1',
        k2: 'v2'
      })
    })
  })

  describe('get', () => {
    it('gets from session storage', async () => {
      global.sessionStorage.getItem = jest.fn((key) => '{"key1":123}')
      expect(await get('key1').run().promise()).toBe(123)
    })

    it('calls appStore with correct app key', async () => {
      await get('key1').run().promise()
      expect(global.sessionStorage.getItem.mock.calls[0]).toEqual([MOCK_APP])
    })
  })
})
