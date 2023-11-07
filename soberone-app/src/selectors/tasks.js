import { createSelector } from 'reselect'
import { values } from 'lodash'

const selectState = state => state.Tasks

export const tasksSelector = createSelector(selectState, state => values(state.tasks))
export const tasksFavoriteSelector = createSelector(selectState, state => values(state.favorites))
export const tasksLoadingSelector = createSelector(selectState, state => state.loading)
export const tasksLoadedSelector = createSelector(selectState, state => state.loaded)
export const tasksFiltersSelector = createSelector(selectState, state => state.filters)

export const taskIdSelector = (state, props) => props.taskId

export const tasksItemSelector = createSelector(
  tasksSelector,
  taskIdSelector,
  (tasks, taskId) => tasks.find(r => r.id === Number(taskId)),
)

export const tasksActiveSelector = createSelector(
  tasksSelector,
  tasks => tasks.filter(item => item.status !== 'finished'),
)

export const tasksFinishedSelector = createSelector(
  tasksSelector,
  tasks => tasks.filter(item => item.status === 'finished'),
)

export const tasksNewSelector = createSelector(
  tasksSelector,
  tasks => tasks.filter(item => item.status === 'new'),
)

// export const tasksFavoriteSelector = createSelector(
//   tasksSelector,
//   favorites => favorites
// )
