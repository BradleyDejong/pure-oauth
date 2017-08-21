/* global crypto, msCrypto */

import {task} from 'folktale/concurrency/task'
const random = () => {
  task(resolver => {
    const arr = new Uint32Array(8)
    const c = crypto || msCrypto
    if (!c || !c.getRandomValues) {
      throw new Error('Cannot find crypto function for state generation')
    }

    c.getRandomValues(arr)
    resolver.resolve(arr.join('-'))
  })
}

export { random }
