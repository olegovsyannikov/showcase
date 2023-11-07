import { FIRE_EVENT } from '../constants/events'

export default function fireEvent(type, handler) {
  return dispatch => {
    const data = {
      success: true,
      type,
      data: handler,
    }
    dispatch({ type: FIRE_EVENT, payload: { data } })
  }
}

export function trackRevenue(revenueData) {
  return dispatch => {
    const data = {
      success: true,
      type: 'Purchase',
      data: revenueData,
    }
    dispatch({ type: FIRE_EVENT, payload: { data } })
  }
}
