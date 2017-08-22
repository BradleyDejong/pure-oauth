import {task} from 'folktale/concurrency/task'
const redirect = url => {
  return task(resolver => {
    window.location.href = url
    resolver.resolve()
  })
}

const currentLocation = task(resolver => {
  resolver.resolve(window.location.href)
})

export { redirect, currentLocation }
