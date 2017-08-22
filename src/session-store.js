import {compose, curry, lensProp, chain, map, set as lset, prop as rprop} from 'ramda'
import {task} from 'folktale/concurrency/task'
import {parseWithDefault} from './json'

/* global sessionStorage */

const appStorage = app => task((resolver) =>
  resolver.resolve(sessionStorage.getItem(app)))
    .map(parseWithDefault({}))

const get = curry((app, prop) => {
  return appStorage(app)
    .map(rprop(prop))
})

const set = curry((app, prop, value) => {
  const setAndStore = start => {
    return task(resolver => {
      compose(
        resolver.resolve,
        obj => sessionStorage.setItem(app, obj),
        JSON.stringify,
        lset(lensProp(prop), value)
      )(start)
    })
  }

  return compose(map(() => value), chain(setAndStore), appStorage)(app)
})

export {
  set,
  get,
  appStorage
}
