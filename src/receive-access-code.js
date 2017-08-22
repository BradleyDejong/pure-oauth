import {compose, prop, map} from 'ramda'
import queryString from 'query-string'
import url from 'url'

import {currentLocation} from './location'

const param = p => compose(
  prop(p),
  queryString.parse,
  prop('query'),
  url.parse
)

const currentState = map(param('state'))(currentLocation)
const currentCode = map(param('code'))(currentLocation)

export {
  currentState,
  currentCode
}
