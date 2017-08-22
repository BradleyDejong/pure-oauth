import {reduce, concat, curry} from 'ramda'
import queryString from 'query-string'

import {set} from './session-store'
import {random} from './random'
import {redirect} from './location'
import {required, oneOf, validate} from './util/validate'
import {resultToTask} from './util/transforms'

const validators = [
  required('client_id'),
  required('redirect_uri'),
  required('response_type'),
  required('state'),
  oneOf(['code', 'token'], 'response_type')
]

const buildAuthUrl = curry((base, params) => {
  return reduce(concat, '', [base, '?', queryString.stringify(params)])
})

const authorize = curry((authorizeUrl, parameters) => {
  return resultToTask(validate(validators, parameters))
    .chain(() => random())
    .chain((rand) => set(parameters.client_id, 'state', rand))
    .chain(() => redirect(buildAuthUrl(authorizeUrl, parameters)))
})

export {
  authorize
}
