import {reduce, concat, curry, set as rset, lensProp, map, chain, compose} from 'ramda'
import queryString from 'query-string'

import {set as sessionSet} from './session-store'
import {random} from './random'
import {redirect} from './location'
import {required, anyOf, validate} from './util/validate'
import {resultToTask} from './util/transforms'

const validators = [
  required('client_id'),
  required('redirect_uri'),
  required('response_type'),
  required('state'),
  anyOf(['code', 'token'], 'response_type')
]

const buildAuthUrl = curry((base, params) => {
  return reduce(concat, '', [base, '?', queryString.stringify(params)])
})

const authorize = curry((authorizeUrl, parameters) => {
  return compose(
    chain(redirect),
    map(buildAuthUrl(authorizeUrl)),
    map(state => rset(lensProp('state'), state, parameters)),
    chain(r => sessionSet(parameters.client_id, 'state', r)),
    chain(() => random()),
    resultToTask,
    validate(validators)
  )(parameters)
})

export {
  authorize
}
