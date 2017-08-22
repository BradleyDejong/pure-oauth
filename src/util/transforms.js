import Task from 'folktale/concurrency/task'

const resultToTask = r => r
  .map(Task.of)
  .mapError(Task.rejected)
  .merge()

export { resultToTask }
