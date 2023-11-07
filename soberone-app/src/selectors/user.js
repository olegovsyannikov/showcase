import { createSelector } from 'reselect'

const selectState = state => state.UserInfo

export const userDataSelector = createSelector(
  selectState,
  state => state.data
)

export const userIdSelector = createSelector(
  userDataSelector,
  userInfo => userInfo.id,
)

export const isPaidSelector = createSelector(
  userDataSelector,
  userInfo => userInfo.is_paid,
)

export const isNeedPaymentCheckSelector = createSelector(
  userDataSelector,
  userInfo => userInfo.need_payment_check,
)

export const userSettingsSelector = createSelector(
  selectState,
  state => state.settings
)

export const isDonateSelector = createSelector(
  userDataSelector,
  userInfo => userInfo.language === 'ru',
)
