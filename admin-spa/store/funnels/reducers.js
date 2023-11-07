import { TYPE_SET_FUNNELS, TYPE_SET_FUNNEL_STAGE } from './types'

const initState = {
  items: [],
}

export default function FunnelsReducers(state = initState, action) {
  switch (action.type) {
    case TYPE_SET_FUNNELS:
      return {
        ...state,
        items: action.funnels
      }

    case TYPE_SET_FUNNEL_STAGE:
      return {
        ...state,
        items: state.items.map(i => {
          if (i.id !== action.funnel.id) {
            return i
          }

          return {
            ...i,
            stages: [
              ...i.stages.filter(j => j.id !== action.stage.id),
              action.stage
            ]
          }
        })
      }

    default:
      return state
  }
}
