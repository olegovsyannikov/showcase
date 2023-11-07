import { createAction } from 'redux-actions'
import fetch from 'isomorphic-fetch'
import qs from 'qs'
import js from 'utils/cookies'
import * as moment from 'moment'

import { apiUrl } from '../config/app'

// Получение записей дневника

export const loadingDiaryAction = createAction('@diary/LOADING_DIARY_LIST')
export const loadedDiaryAction = createAction('@diary/LOADED_DIARY_LIST')
export const errorLoadingDiaryAction = createAction('@diary/ERROR_LOADING_DIARY_LIST')

export const getDiary = params => (dispatch, getState) => {
  const state = getState()
  // const filter = diaryFiltersSelector(state);

  const queryString = params ? `${qs.stringify({ ...state.Diary.params, ...params })}` : ''

  dispatch(loadingDiaryAction())
  return fetch(`${apiUrl}/diary?${queryString}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${js.cookie('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(data => data.json())
    .then(data => dispatch(loadedDiaryAction(data, params)))
    .catch(e => dispatch(errorLoadingDiaryAction(e)))
}

// Получение записи дневника

export const loadingDiaryItemAction = createAction('@diary/LOADING_DIARY_ITEM')
export const loadedDiaryItemAction = createAction('@diary/LOADED_DIARY_ITEM')
export const errorLoadingDiaryItemAction = createAction('@diary/ERROR_LOADING_DIARY_ITEM')

export const getDiaryItem = id => dispatch => {
  dispatch(loadingDiaryItemAction({ id: Number(id) }))
  return fetch(`${apiUrl}/diary/${id}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${js.cookie('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(data => data.json())
    .then(data => {
      if (data.error) {
        const { error, message: errorMessage } = data
        return dispatch(errorLoadingDiaryItemAction({ id: Number(id), error, errorMessage }))
      }
      return dispatch(loadedDiaryItemAction({ data }))
    })
    .catch(() => dispatch(errorLoadingDiaryItemAction({ id: Number(id), error: true, errorMessage: 'Server error' })))
}

export const findDiaryItem = ({ date }) => dispatch => fetch(`${apiUrl}/diary?from=${date}&to=${date}`, {
  method: 'get',
  headers: {
    Authorization: `Bearer ${js.cookie('token')}`,
    'Content-Type': 'application/json',
  },
}).then(data => data.json())
  .then(data => {
    if (data.length) {
      return dispatch(loadedDiaryItemAction({ data: data[0] }))
    }
    return false
  })
  .catch(() => dispatch(errorLoadingDiaryItemAction({ id: null, error: true, errorMessage: 'Server error' })))

// Создание записи дневника

export const creatingDiaryItemAction = createAction('@diary/CREATING_DIARY_ITEM')
export const createdDiaryItemAction = createAction('@diary/CREATED_DIARY_ITEM')
export const errorCreatingDiaryItemAction = createAction('@diary/ERROR_CREATING_DIARY_ITEM')

export const createDiaryItem = params => dispatch => {
  dispatch(creatingDiaryItemAction())
  return fetch(`${apiUrl}/diary`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${js.cookie('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  }).then(data => data.json())
    .then(data => dispatch(createdDiaryItemAction({ data })))
    .catch(e => dispatch(errorCreatingDiaryItemAction(e)))
}

// Обновление записи дневника

export const updatingDiaryItemAction = createAction('@diary/UPDATING_DIARY_ITEM')
export const updatedDiaryItemAction = createAction('@diary/UPDATED_DIARY_ITEM')
export const errorUpdatingDiaryItemAction = createAction('@diary/ERROR_UPDATING_DIARY_ITEM')

export const updateDiaryItem = (id, params) => dispatch => {
  dispatch(updatingDiaryItemAction({ id: Number(id) }))
  return fetch(`${apiUrl}/diary/${id}`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${js.cookie('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  }).then(data => data.json())
    .then(data => dispatch(updatedDiaryItemAction({ data })))
    .catch(e => dispatch(errorUpdatingDiaryItemAction(e)))
}

export const saveDiaryItem = params => dispatch => {
  const date = moment(params.timestamp).format('YYYY-MM-DD')
  return fetch(`${apiUrl}/diary?from=${date}&to=${date}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${js.cookie('token')}`,
      'Content-Type': 'application/json',
    },
  })
    .then(data => data.json())
    .then(data => {
      if (data.length) {
        const { id } = data[0]
        dispatch(updateDiaryItem(id, params))
      } else {
        dispatch(createDiaryItem(params))
      }
    })
}

// Фильтрация дневника

export const filterDiaryAction = createAction('@diary/FILTER_DIARY_LIST')

export const filterDiary = filters => dispatch => {
  localStorage.setItem('diary_filters', JSON.stringify(filters))
  dispatch(filterDiaryAction({ filters }))
}
