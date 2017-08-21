import {task} from 'folktale/concurrency/task'
let r = 0

const random = () => {
  return task(resolver => {
    resolver.resolve(r)
  })
}

const __setFakeRandom = val => {
  r = val
}

export {
  random,
  __setFakeRandom
}
