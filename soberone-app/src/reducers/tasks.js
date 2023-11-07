import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import { isEmpty, each } from 'lodash'

import {
  loadingTasksAction,
  loadedTasksAction,
  // errorLoadingTasksAction,

  loadingTasksItemAction,
  loadedTasksItemAction,
  errorLoadingTasksItemAction,

  // updatingTasksItemAction,
  updatedTasksItemAction,
  // errorUpdatingTasksItemAction,

  filterTasksAction,
} from 'actions/TasksActions'

export const defaultState = {
  loading: false,
  loaded: false,
  error: null,
  tasks: {},
  newTasks: 0,
  filters: localStorage.getItem('task_filters') ? JSON.parse(localStorage.getItem('task_filters')) : {
    type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    stage: [0, 1, 2, 3, 4],
  },
  favorites: {}
}

const Tasks = handleActions({
  [loadingTasksAction]: state => update(state, {
    loading: { $set: true },
    loaded: { $set: false },
  }),

  [loadedTasksAction]: (state, action) => {
    const { tasks, newTasks: newTasksCount, favorites } = action.payload
    const { tasks: stateTasks } = state
    const newState = { tasks: {}, favorites: {} }

    each(tasks, item => {
      newState.tasks[item.id] = stateTasks[item.id] ? { $merge: item } : { $set: item }
    })

    each(favorites, item => {
      newState.favorites[item.id] = stateTasks[item.id] ? { $merge: item } : { $set: item }
    })

    return update(state, {
      loading: { $set: false },
      loaded: { $set: true },
      tasks: newState.tasks,
      newTasks: { $set: newTasksCount },
      favorites: newState.favorites,
    })
  },

  [loadingTasksItemAction]: (state, action) => {
    const { id } = action.payload
    const { tasks } = state
    const newState = { tasks: {} }

    const obj = { loading: true, loaded: false, error: false, id }
    newState.tasks[id] = isEmpty(tasks) ? { $set: obj } : { $merge: obj }

    return update(state, newState)
  },

  [loadedTasksItemAction]: (state, action) => {
    const { data } = action.payload
    const { tasks } = state
    const newState = { tasks: {} }

    const obj = { loading: false, loaded: true, error: false, ...data }
    newState.tasks[data.id] = isEmpty(tasks) ? { $set: obj } : { $merge: obj }

    return update(state, newState)
  },

  [errorLoadingTasksItemAction]: (state, action) => {
    const { id, error, errorMessage } = action.payload
    const { tasks } = state
    const newState = { tasks: {} }

    const obj = { id, error, errorMessage }
    newState.tasks[id] = isEmpty(tasks) ? { $set: obj } : { $merge: obj }

    return update(state, newState)
  },

  [updatedTasksItemAction]: (state, action) => {
    const { data } = action.payload

    const newState = {}
    newState[data.id] = { $merge: data }

    const favorites = state.favorites
    if (data.is_favorite) {
      favorites[data.id] = {
        ...state.tasks[data.id],
        ...data
      }
    } else {
      delete favorites[data.id]
    }

    return {
      ...state,
      tasks: update(state.tasks, newState),
      favorites
    }
  },

  [filterTasksAction]: (state, action) => {
    const { filters } = action.payload
    return update(state, {
      filters: { $set: filters },
    })
  },
}, defaultState)

export default Tasks
