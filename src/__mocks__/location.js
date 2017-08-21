import {task} from 'folktale/concurrency/task'
let current = 'start-url'

const __current = () => current

const redirect = url => task(resolver => {
  current = url
  resolver.resolve()
})

export { redirect, __current }
