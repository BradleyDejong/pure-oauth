import {task} from 'folktale/concurrency/task'

let current = 'start-url'

const __current = () => current
const __set = u => {
  current = u
}

const redirect = url => task(resolver => {
  current = url
  resolver.resolve()
})

const currentLocation = task(resolver => resolver.resolve(current))

export { redirect, __set, __current, currentLocation }
