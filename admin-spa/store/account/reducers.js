import { TYPE_SET_TOKEN, TYPE_SET_USER } from './types'

const initState = {
  token: null,
  user: null,
}

export default function AccountReducers(state = initState, action) {
  switch (action.type) {
    case TYPE_SET_TOKEN:
      return { ...state, token: action.token }

    case TYPE_SET_USER:
      return { ...state, user: action.user }

    default:
      return state
  }
}
