import R from 'ramda'

const log = R.curry((prefix, x) => {
  console.log(prefix, x)
  return x
})

export default log
