import {compose, curry, lensProp, map, set as lset, prop as rprop} from 'ramda'
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
  const setAndStore = compose(
    obj => sessionStorage.setItem(app, obj)
    , JSON.stringify
    , lset(lensProp(prop), value)
  )

  return compose(map(setAndStore), appStorage)(app)
})

export {
  set,
  get,
  appStorage
}
