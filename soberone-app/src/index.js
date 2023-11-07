import React from 'react'
import ReactDOM from 'react-dom'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import loadable from '@loadable/component'

import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import { isPlatform } from '@ionic/react'
import { defineCustomElements } from '@ionic/pwa-elements/loader'

//import App from './App'
const App = loadable(() => import('./App'), {
  fallback: <div className='ldr'></div>,
})

import { AnalyticsProvider } from './hooks/analytics'

import createAppStore, { history } from './store/create'
import { sentryDsn } from './config/app'
import { initializeFirebase } from './firebaseInit'

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [new Integrations.BrowserTracing()],
  })
}

const store = createAppStore()

ReactDOM.render(
  <AnalyticsProvider>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Route path='/' component={App} />
      </ConnectedRouter>
    </Provider>
  </AnalyticsProvider>,
  document.getElementById('app')
)

defineCustomElements(window)

if (!isPlatform('android') && !isPlatform('ios')) {
  initializeFirebase()
}
