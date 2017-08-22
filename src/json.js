import R from 'ramda'
import Result from 'folktale/result'

const fromJSON = json => {
  try {
    const val = JSON.parse(json)
    return Result.Ok(val || {})
  } catch (e) {
    return Result.Error(e)
  }
}

const parseWithDefault = def => R.compose(
  result => result.getOrElse(def),
  json => fromJSON(json)
)

export {
  fromJSON
  , parseWithDefault
}
