import Result from 'folktale/result'
import {traverse, reduce, curry} from 'ramda'

const required = curry((name, obj) => {
  return obj[name]
    ? Result.Ok(obj)
    : Result.Error(`${name} is required`)
})

const anyOf = curry((values, name, obj) => {
  return reduce((acc, curr) => acc || obj[name] === curr, false, values)
    ? Result.Ok(obj)
    : Result.Error(`${name} must be one of [${values.map(val => `'${val}'`).join(', ')}]`)
})

const validate = curry((validators, obj) => {
  return traverse(Result.of, validator => validator(obj), validators)
})

export {required, anyOf, validate}
