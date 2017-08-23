import {curry, identity, compose, prop, map} from 'ramda'
import queryString from 'query-string'
import url from 'url'
import Task from 'folktale/concurrency/task'

import {currentLocation} from './location'
import {get as sessionGet} from './session-store'
import {eq} from './util/validate'
import {resultToTask} from './util/transforms'

const param = p => compose(
  prop(p),
  queryString.parse,
  prop('query'),
  url.parse
)

const currentState = map(param('state'))(currentLocation)
const currentCode = map(param('code'))(currentLocation)
const storedState = sessionGet

const validateState = app => {
  return Task.of(eq)
    .ap(currentState)
    .ap(storedState(app, 'state'))
    .map(result => result.mapError(() => 'State validation failed'))
    .map(resultToTask)
    .chain(identity)
}

const getAccessCodeAndState = app =>
  validateState(app)
  .chain(() => Task.of(curry((code, state) => ({code, state})))
    .ap(currentCode)
    .ap(currentState)
  )

export {
  currentState,
  currentCode,
  validateState,
  getAccessCodeAndState
}
