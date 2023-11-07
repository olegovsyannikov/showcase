import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'

import layout from './layout/reducers'
import funnels from './funnels/reducers'
import tasks from './tasks/reducers'
import account from './account/reducers'

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return applyMiddleware(...middleware)
}

export const initStore = () => {
  return createStore(
    combineReducers({
      layout,
      funnels,
      tasks,
      account,
    }),
    bindMiddleware([thunkMiddleware])
  )
}
