import { TYPE_SET_TASKS } from './types'

export const setTasks = (tasks) => ({
  type: TYPE_SET_TASKS,
  tasks,
})
