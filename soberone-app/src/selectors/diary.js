import { createSelector } from 'reselect'
import { values } from 'lodash'

const selectState = state => state.Diary

export const allDiarySelector = createSelector(selectState, state => values(state.diary))
export const diaryLoadingSelector = createSelector(selectState, state => state.loading)
export const diaryLoadedSelector = createSelector(selectState, state => state.loaded)
export const diaryFiltersSelector = createSelector(selectState, state => state.filters)

export const diaryItemParamsSelector = (state, props) => props.params

export const diarySelector = createSelector(
  allDiarySelector,
  diaryFiltersSelector,
  (diary, filters) => diary.filter(item => filters.rating.includes(item.rating)),
)

export const diaryItemSelector = createSelector(
  allDiarySelector,
  diaryItemParamsSelector,
  (diary, params) => {
    const result = diary.find(r => r.id === Number(params.diaryId))
    return result
  },
)
