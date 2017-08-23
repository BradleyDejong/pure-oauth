import request from 'superagent'
import {curry, compose, prop} from 'ramda'
import {task} from 'folktale/concurrency/task'

const post = curry((url, params) => {
  return task(resolver => {
    request.post(url)
      .type('form')
      .send(params)
      .then(compose(resolver.resolve, prop('body')))
      .catch(err => {
        resolver.reject(err)
      })
  })
})

const exchangeToken = curry((clientId, redirectUri, tokenUri, code) =>
  post(tokenUri, {
    grant_type: 'authorization_code',
    code,
    client_id: clientId,
    redirect_uri: redirectUri
  }))

export {
  exchangeToken
}
