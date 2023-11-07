import { TYPE_SET_TASKS } from './types'

const initState = {
  items: [],
}

export default (state = initState, action) => {
  switch (action.type) {
    case TYPE_SET_TASKS:
      return { ...state, items: action.tasks }

    default:
      return state
  }
}
