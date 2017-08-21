import {task} from 'folktale/concurrency/task'
const redirect = url => task(resolver => {
  window.location.href = url
  resolver.resolve()
})

export { redirect }
