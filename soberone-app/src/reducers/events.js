import {
  FIRE_EVENT,
} from '../constants/events'

export default function EventsInfo(state = {
  data: null,
}, {
  type,
  payload,
}) {
  switch (type) {
    case FIRE_EVENT:
      return {
        data: payload.data,
      }
    default:
      return state
  }
}
