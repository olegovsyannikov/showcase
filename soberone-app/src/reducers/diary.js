import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import { isEmpty, each } from 'lodash'

import {
  loadingDiaryAction,
  loadedDiaryAction,
  // errorLoadingDiaryAction,

  loadingDiaryItemAction,
  loadedDiaryItemAction,
  errorLoadingDiaryItemAction,

  // updatingDiaryItemAction,
  updatedDiaryItemAction,
  // errorUpdatingDiaryItemAction,

  // creatingDiaryItemAction,
  createdDiaryItemAction,
  // errorCreatingDiaryItemAction,

  filterDiaryAction,
} from 'actions/DiaryActions'

export const defaultState = {
  loading: false,
  loaded: false,
  error: null,
  diary: {},
  filters: localStorage.getItem('diary_filters') ? JSON.parse(localStorage.getItem('diary_filters')) : {
    rating: [0, 1, 2, 3, 4, 5, 6],
  },
}

const Diary = handleActions({
  [loadingDiaryAction]: state => update(state, {
    loading: { $set: true },
    loaded: { $set: false },
  }),

  [loadedDiaryAction]: (state, action) => {
    const diary = action.payload
    const { diary: stateDiary } = state
    const newState = { diary: {} }

    each(diary, item => {
      newState.diary[item.id] = stateDiary[item.id] ? { $merge: item } : { $set: item }
    })

    return update(state, {
      loading: { $set: false },
      loaded: { $set: true },
      diary: newState.diary,
    })
  },

  [loadingDiaryItemAction]: (state, action) => {
    const { id } = action.payload
    const { diary } = state
    const newState = { diary: {} }

    const obj = { loading: true, loaded: false, error: false, id }
    newState.diary[id] = isEmpty(diary) ? { $set: obj } : { $merge: obj }

    return update(state, newState)
  },

  [loadedDiaryItemAction]: (state, action) => {
    const { data } = action.payload
    const { diary } = state
    const newState = { diary: {} }

    const obj = { loading: false, loaded: true, error: false, ...data }
    newState.diary[data.id] = isEmpty(diary) ? { $set: obj } : { $merge: obj }

    return update(state, newState)
  },

  [errorLoadingDiaryItemAction]: (state, action) => {
    const { id, error, errorMessage } = action.payload
    const { diary } = state
    const newState = { diary: {} }

    const obj = { id, error, errorMessage }
    newState.diary[id] = isEmpty(diary) ? { $set: obj } : { $merge: obj }

    return update(state, newState)
  },

  [createdDiaryItemAction]: (state, action) => {
    const { data } = action.payload

    return update(state, {
      diary: {
        $merge: {
          [data.id]: data,
        },
      },
    })
  },

  [updatedDiaryItemAction]: (state, action) => {
    const { data } = action.payload

    return update(state, {
      diary: {
        [data.id]: { $merge: data },
      },
    })
  },

  [filterDiaryAction]: (state, action) => {
    const { filters } = action.payload
    return update(state, {
      filters: { $set: filters },
    })
  },
}, defaultState)

export default Diary
