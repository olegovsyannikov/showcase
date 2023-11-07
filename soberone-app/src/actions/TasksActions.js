import { createAction } from 'redux-actions'
import fetch from 'isomorphic-fetch'
import qs from 'qs'

import js from 'utils/cookies'
import {
  tasksFiltersSelector,
} from 'selectors/tasks'

import { apiUrl } from '../config/app'

// Получение списка заданий

export const loadingTasksAction = createAction('@tasks/LOADING_TASKS_LIST')
export const loadedTasksAction = createAction('@tasks/LOADED_TASKS_LIST')
export const errorLoadingTasksAction = createAction('@tasks/ERROR_LOADING_TASKS_LIST')

export const getTasks = () => (dispatch, getState) => {
  const state = getState()
  const filter = tasksFiltersSelector(state)

  dispatch(loadingTasksAction())
  return fetch(`${apiUrl}/tasks?${qs.stringify(filter)}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${js.cookie('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(data => data.json())
    .then(data => dispatch(loadedTasksAction(data)))
    .catch(e => dispatch(errorLoadingTasksAction(e)))
}

// Получение информации о задании

export const loadingTasksItemAction = createAction('@tasks/LOADING_TASKS_ITEM')
export const loadedTasksItemAction = createAction('@tasks/LOADED_TASKS_ITEM')
export const errorLoadingTasksItemAction = createAction('@tasks/ERROR_LOADING_TASKS_ITEM')

export const getTasksItem = (id, mode) => dispatch => {
  dispatch(loadingTasksItemAction({ id: Number(id) }))
  const query = mode ? `/${mode}` : ''
  return fetch(`${apiUrl}/tasks/${id}${query}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${js.cookie('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(data => data.json())
    .then(data => {
      if (data.error) {
        const { error, message: errorMessage } = data
        return dispatch(errorLoadingTasksItemAction({ id: Number(id), error, errorMessage }))
      }
      return dispatch(loadedTasksItemAction({ data }))
    })
    .catch(() => dispatch(errorLoadingTasksItemAction({ id: Number(id), error: true, errorMessage: 'Server error' })))
}

// Обновление информации о задании

export const updatingTasksItemAction = createAction('@tasks/UPDATING_TASKS_ITEM')
export const updatedTasksItemAction = createAction('@tasks/UPDATED_TASKS_ITEM')
export const errorUpdatingTasksItemAction = createAction('@tasks/ERROR_UPDATING_TASKS_ITEM')

export const updateTasksItem = (id, params) => dispatch => {
  dispatch(updatingTasksItemAction({ id: Number(id) }))
  return fetch(`${apiUrl}/tasks/${id}`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${js.cookie('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  }).then(data => data.json())
    .then(() => dispatch(updatedTasksItemAction({ data: { id: Number(id), ...params } })))
    .catch(e => dispatch(errorUpdatingTasksItemAction(e)))
}

// Изменить статус в избранном

export const favoriteTasksItem = (id, params) => dispatch => {
  const newFavoriteStatus = !params.isFavorite ? 1 : 0
  return dispatch(updateTasksItem(id, { is_favorite: newFavoriteStatus }))
}

// Фильтрация заданий
export const filterTasksAction = createAction('@tasks/FILTER_TASKS_LIST')

export const filterTasks = filters => dispatch => {
  localStorage.setItem('task_filters', JSON.stringify(filters))
  dispatch(filterTasksAction({ filters }))
}
