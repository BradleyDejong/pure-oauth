import Task from 'folktale/concurrency/task'
import Result from 'folktale/result'
import {curry} from 'ramda'

import {set} from './session-store'
import {random} from './random'
import {redirect} from './location'

const resultToTask = r => r
  .map(Task.of)
  .mapError(Task.rejected)
  .merge()

const validate = p => {
  return ['client_id', 'redirect_uri', 'response_type', 'state']
    .reduce((acc, curr) => {
      return p[curr]
        ? acc.chain(() => Result.Ok(p))
        : Result.Error(`${curr} is required`)
    }, Result.Ok(p))
}

const authorize = curry((app, authorizeUrl, parameters) => {
  return resultToTask(validate(parameters))
    .chain(() => random())
    .chain((rand) => set(app, 'state', rand))
    .chain(() => redirect(authorizeUrl))
})

export {
  authorize
}
