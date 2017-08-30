
import {exchangeToken} from './token-exchange'
import {getAccessCodeAndState} from './receive-access-code'
import {authorize} from './authorize'

const go = (clientId, authUrl, redirectUri, responseType = 'code', tokenUri) => {
  let cb
  let savedToken

  const toReturn = {
    onValue: f => {
      cb = f
      if (savedToken) {
        f(savedToken)
      }
    }
  }

  getAccessCodeAndState(clientId)
    .run().promise()
    .catch(err => {
      console.log('Failed to authorize', err)
      return authorize(authUrl, {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: responseType
      }).run().promise()
    })
    .then(res => {
      return exchangeToken(clientId, redirectUri, tokenUri, res.code).run().promise()
    })
    .then(token => {
      if (cb) {
        cb(token)
      } else {
        savedToken = token
      }
    })

  return toReturn
}

export {
  exchangeToken,
  getAccessCodeAndState,
  authorize,
  go
}
