import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import createRootReducer from 'reducers'

/* eslint-disable */
const preloadedState = window.__PRELOADED_STATE__ || {};

const isDev = process.env.NODE_ENV === 'development';

export const history = createBrowserHistory();

export default function createAppStore() {
  const middlewares = [thunk, routerMiddleware(history)];

  const devTools = isDev && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : x => (x);

  const store = createStore(
    createRootReducer(history),
    preloadedState,
    compose(applyMiddleware(...middlewares), devTools),
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => store.replaceReducer(createRootReducer(history)));
  }

  return store;
}
