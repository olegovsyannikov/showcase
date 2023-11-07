import { handleActions } from 'redux-actions'
import update from 'immutability-helper'

import {
  updateSupportBadgeAction,
} from 'actions/MenuActions'

export const defaultState = {
  supportUnreadCount: 0,
}

const Menu = handleActions({
  [updateSupportBadgeAction]: (state, action) => {
    const { unreadCount } = action.payload
    return update(state, { supportUnreadCount: { $set: unreadCount } })
  },
}, defaultState)

export default Menu
