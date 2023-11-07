import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Route, Redirect, Switch, matchPath } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { bindActionCreators } from 'redux'
import { pick } from 'lodash'
import { useTranslation } from 'react-i18next'
import loadable from '@loadable/component'

import moment from 'moment'
import 'moment/locale/ru'
import 'moment/locale/en-gb'

import 'bundle'
import * as Sentry from '@sentry/browser'

import { PushNotifications } from '@capacitor/push-notifications'
import { isPlatform, IonApp, IonToast, IonAlert, IonLoading } from '@ionic/react'

// Hocs
import { withBodyClassName } from 'hocs'

// Actions
import { auth, logout, fetchUser, fetchUserInfoLegacy, updateUser, setUserProfile } from 'actions/UserActions'
import fireEvent from 'actions/EventsActions'
import { showSnackbar, hideSnackbar } from 'actions/SnackbarActions'
import { getTasks } from 'actions/TasksActions'
import { updateSupportBadgeAction } from 'actions/MenuActions'
import { enableProcessing, disableProcessing } from 'actions/PaymentsActions'

// Global
import global from 'utils/global'

// Components
import Footer from 'components/Footer/Footer'
import Snackbar from 'components/Snackbar/Snackbar'

import 'App.styl'

import js from 'utils/cookies'
import routes from 'config/routes'
import { footerMenu } from 'config/menu'

import i18n from './i18n'

import { getFirebaseMessaging, askForPermissionToReceiveNotifications } from './firebaseInit'

import { useCentrifuge } from './hooks/centrifuge'
import { useAnalytics } from './hooks/analytics'

// Pages
// import ProfilePayments from 'pages/Profile/ProfilePayments'
// import Cpayment from 'pages/Cpayment/Cpayment'

const components = {
  NotFoundPage: loadable(() => import(
    /* webpackChunkName: "404" */
    /* webpackPrefetch: true */
    'pages/404/404'
  )),
  Intro: loadable(() => import(
    /* webpackChunkName: "Intro" */
    /* webpackPreload: true */
    'pages/Intro/Intro'
  ), {
    fallback: <div className='ldr'></div>,
  }),
  Recovery: loadable(() => import(
    /* webpackChunkName: "Auth" */
    /* webpackPreload: true */
    'pages/Recovery/Recovery'
  )),
  Auth: loadable(() => import(
    /* webpackChunkName: "Auth" */
    /* webpackPreload: true */
    'pages/Auth/Auth'
  )),
  Register: loadable(() => import(
    /* webpackChunkName: "Auth" */
    /* webpackPreload: true */
    'pages/Register/Register'
  )),
  Home: loadable(() => import(
    /* webpackChunkName: "Home" */
    /* webpackPrefetch: true */
    'pages/Home/Home'
  )),
  More: loadable(() => import(
    /* webpackChunkName: "More" */
    /* webpackPrefetch: true */
    'pages/More/More'
  )),
  Profile: loadable(() => import(
    /* webpackChunkName: "Profile" */
    /* webpackPrefetch: true */
    'pages/Profile/Profile'
  )),
  ProfileEdit: loadable(() => import(
    /* webpackChunkName: "Profile" */
    /* webpackPrefetch: true */
    'pages/Profile/ProfileEdit'
  )),
  ProfileSettings: loadable(() => import(
    /* webpackChunkName: "Profile" */
    /* webpackPrefetch: true */
    'pages/Profile/ProfileSettings'
  )),
  TasksList: loadable(() => import(
    /* webpackChunkName: "Tasks" */
    /* webpackPrefetch: true */
    'pages/Tasks/TasksList'
  )),
  TasksItem: loadable(() => import(
    /* webpackChunkName: "Tasks" */
    /* webpackPrefetch: true */
    'pages/Tasks/TasksItem'
  )),
  TasksItemPerform: loadable(() => import(
    /* webpackChunkName: "Tasks" */
    /* webpackPrefetch: true */
    'pages/Tasks/TasksItemPerform'
  )),
  TasksFilter: loadable(() => import(
    /* webpackChunkName: "Tasks" */
    /* webpackPrefetch: true */
    'pages/Tasks/TasksFilter'
  )),
  TestList: loadable(() => import(
    /* webpackChunkName: "Tests" */
    /* webpackPrefetch: true */
    'pages/TestList/TestList'
  )),
  TestDetails: loadable(() => import(
    /* webpackChunkName: "Tests" */
    /* webpackPrefetch: true */
    'pages/TestDetails/TestDetails'
  )),
  Tools: loadable(() => import(
    /* webpackChunkName: "Tools" */
    /* webpackPrefetch: true */
    'pages/Tools/Tools'
  )),
  Diary: loadable(() => import(
    /* webpackChunkName: "Diary" */
    /* webpackPrefetch: true */
    'pages/Diary/Diary'
  )),
  DiaryItem: loadable(() => import(
    /* webpackChunkName: "Diary" */
    /* webpackPrefetch: true */
    'pages/Diary/DiaryItem'
  )),
  DiaryFilter: loadable(() => import(
    /* webpackChunkName: "Diary" */
    /* webpackPrefetch: true */
    'pages/Diary/DiaryFilter'
  )),
  Confirm: loadable(() => import(
    /* webpackChunkName: "Confirm" */
    /* webpackPrefetch: true */
    'pages/Confirm/Confirm'
  )),
  Premium: loadable(() => import(
    /* webpackChunkName: "Premium" */
    /* webpackPrefetch: true */
    'pages/Premium/Premium'
  )),
  HelpUs: loadable(() => import(
    /* webpackChunkName: "HelpUs" */
    /* webpackPrefetch: true */
    'pages/HelpUs/HelpUs'
  )),
}
// const preload = component => {
//   component.preload && component.preload()
// }

export const App = (props) => {
  const {
    UserInfo: { isAuthorized, data: userProfile },
    FooterState,
    SnackbarInfo,
    EventsInfo: { data: eventData },
    actions,
    location,
    match: {
      params: { confirmationToken },
    },
    dispatch,
  } = props

  const { t } = useTranslation()

  const [checked, setChecked] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastHeader, setToastHeader] = useState('')
  const [toastBody, setToastBody] = useState('')
  const [successPaymentAlertVisible, setSuccessPaymentAlertVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const centrifuge = useCentrifuge()
  const { sendEvent, identify } = useAnalytics()

  // React.useEffect(() => {
  //   preload(components['Intro'])
  //   preload(components['Auth'])
  //   preload(components['Register'])
  // }, [])

  useEffect(() => {
    const initializeApp = async () => {

      if (location.search) {
        js.cookie('query', location.search, { path: '/' })
      }

      if (!js.cookie('first_launch')) {
        actions.fireEvent('first_launch')
        global.gtm.trackEvent('StartTrial', {})
        js.cookie('first_launch', true, {
          path: '/',
          expires: 9e5,
        })
      }

      const jwtToken = js.cookie('jwt') || null
      if (jwtToken) {
        actions.fetchUser(jwtToken)
      } else {
        // TODO: legacy remove
        const parseToken = location.pathname.match(/\/cpayment\/([\d\w.-]+)/)
        if (parseToken && parseToken[1]) {
          js.cookie('token', parseToken[1], {
            path: '/',
            expires: 9e5,
          })
        }

        const token = (parseToken && parseToken[1]) || js.cookie('token') || null

        if (token) {
          actions.fetchUserInfoLegacy(token).then((res) => {
            const {
              payload: { data, error },
            } = res

            if (error) {
              actions.logout()
            } else {
              // Update timezone
              const timezone = moment.tz.guess()
              if (data.timezone === 'undefined' || timezone !== data.timezone) {
                actions.updateUser({ timezone })
              }

              // Update onboarding info
              if (js.cookie('onboarding')) {
                try {
                  const onboarding = JSON.parse(js.cookie('onboarding'))
                  actions.updateUser(onboarding)
                  js.cookie('onboarding', null)
                } catch (e) {
                  Sentry.captureException(e)
                }
              }
            }
          })
        } else {
          actions.auth('init')
        }
      }

      moment.locale(i18n.language)

      actions.fireEvent('session_start')

      window.addEvent = (elem, type, callback) => {
        const evt = (e) => callback.call(elem, e || window.event)
        const cb = (e) => evt(e)
        if (elem.addEventListener) {
          elem.addEventListener(type, cb, false)
        } else if (elem.attachEvent) {
          elem.attachEvent(`on${type}`, cb)
        }
        return elem
      }

      window.findParent = (child, filter, root) => {
        // eslint-disable-next-line
        do {
          if (filter(child)) return child
          if (root && child === root) return false
        } while ((child = child.parentNode)) // eslint-disable-line
        return false
      }

      window.hasClass = (elem, cls) => elem.classList && elem.classList.contains(cls)

      Array.from(document.querySelectorAll('[type=checkbox]')).forEach((checkbox) => {
        checkbox.addEventListener('touchstart', function touchstart() {
          setChecked(!checked)
        })
        checkbox.addEventListener('click', (e) => {
          e.preventDefault()
        })
      })

      window.soUpdateSupportBadge = (params) => {
        const paramsData = JSON.parse(params)
        dispatch(updateSupportBadgeAction({ count: paramsData.count }))
      }

      window.soUpdatePaymentProcessingStatus = (status) => {
        if (status) {
          actions.enableProcessing()
        } else {
          actions.disableProcessing()
        }
      }

      setIsLoading(false)
    }

    initializeApp()
  }, []) // eslint-disable-line

  useEffect(() => {
    if (isAuthorized) {
      const { id: userId } = userProfile

      if (userId) {
        if (centrifuge) {
          centrifuge.subscribe(`tasks#${userId}`, () => {
            actions.getTasks()
          })
          centrifuge.subscribe(`profile#${userId}`, (response) => {
            const paymentStatusIsChanged = !userProfile.is_paid && response.data.is_paid
            actions.setUserProfile(response.data)
            if (paymentStatusIsChanged) {
              setSuccessPaymentAlertVisible(true)
              actions.disableProcessing()
            }
          })
        }

        identify(userProfile)
      }

      if (isPlatform('capacitor')) {
        PushNotifications.requestPermissions().then((result) => {
          if (result.receive == 'granted') {
            PushNotifications.register()
          } else {
            console.log('Notification: requesting permissions failed')
          }
        })

        // On succcess, we should be able to receive notifications
        PushNotifications.addListener('registration', (fcmToken) => {
          console.log('Push registration success, fcmToken: ', fcmToken.value)
          localStorage.setItem('notification-token', fcmToken.value)
          actions.updateUser({ firebase_token: fcmToken.value })
        })

        // Some issue with your setup and push will not work
        PushNotifications.addListener('registrationError', (error) => {
          console.log('Error on registration: ', error)
        })

        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          // { id: notification.id, title: notification.title, body: notification.body }
          console.log('Notification received: ', notification)
          setToastHeader(notification.title)
          setToastBody(notification.body)
          setShowToast(true)
        })

        // Method called when tapping on a notification
        PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
          // { id: action.notification.data.id, title: action.notification.data.title, body: action.notification.data.body }
          console.log('Notification tapped: ', action)
        })
      } else {
        askForPermissionToReceiveNotifications()
          .then((fcmToken) => {
            try {
              localStorage.setItem('notification-token', fcmToken)
              actions.updateUser({ firebase_token: fcmToken.value })

              const messaging = getFirebaseMessaging()
              messaging.onMessage((payload) => {
                const { notification } = payload
                console.log('Notification received: ', notification)
                setToastHeader(notification.title)
                setToastBody(notification.body)
                setShowToast(true)
              })
            } catch (error) {
              console.log(error)
            }
          })
          .catch((error) => {
            console.log(`FCM init failed: [${error.message}]`)
          })
      }

      actions.getTasks()
    }
  }, [isAuthorized]) // eslint-disable-line

  useEffect(() => {
    if (eventData) {
      const { type, data } = eventData
      sendEvent(type, data)
    }
  }, [eventData, sendEvent])

  let animation = 'switch'

  const currentRoute = routes.filter((route) => matchPath(location.pathname, route))[0]
  if (currentRoute !== undefined && currentRoute.animation !== undefined) {
    animation = currentRoute.animation
  }

  if (isLoading) {
    return(
      <div className='ldr'></div>
    )
  }

  return (
    (isAuthorized !== undefined || !js.cookie('token')) && (
      <IonApp
        style={{
          marginTop: isPlatform('ios') && Boolean(window.webkit && window.webkit.messageHandlers) ? '30px' : 'auto',
        }}
      >
        <IonLoading isOpen={isLoading} />

        <IonToast
          isOpen={showToast}
          position={'top'}
          color={'light'}
          onDidDismiss={() => setShowToast(false)}
          header={toastHeader}
          message={toastBody}
          duration={2000}
        />

        {userProfile.paid_until > 0 && (
          <IonAlert
            isOpen={successPaymentAlertVisible}
            onDidDismiss={() => setSuccessPaymentAlertVisible(false)}
            header={t('messages.premium.title')}
            // subHeader={'Subtitle'}
            message={`${t('messages.premium.text')} ${moment
              .unix(userProfile.paid_until)
              .utc(true)
              .local()
              .format('DD.MM.YYYY')}`}
            buttons={['Ok']}
          />
        )}

        <TransitionGroup>
          <CSSTransition timeout={200} classNames={animation} key={location.key}>
            <Switch location={location}>
              {routes.map((route) => {
                const RouteComponent = components[route.component]

                return (
                  route.enabled({ isAuthorized, userInfo: userProfile }) && (
                    <Route
                      key={route.path}
                      animation='aa'
                      render={(p) => (
                        // <Suspense fallback={<IonLoading />}>
                        //   <RouteComponent {...p} />
                        // </Suspense>
                        <RouteComponent {...p} />
                      )}
                      {...pick(route, ['exact', 'path'])}
                    />
                  )
                )
              })}
              {!confirmationToken && (
                <>
                  {isAuthorized && (
                    <Route exact path='/auth'>
                      <Redirect to='/' />
                    </Route>
                  )}
                  {!isAuthorized && (
                    <Route path='/'>
                      <Redirect to='/welcome' />
                    </Route>
                  )}
                </>
              )}
            </Switch>
          </CSSTransition>
        </TransitionGroup>

        <Snackbar info={SnackbarInfo} action={actions.hideSnackbar} />

        {isAuthorized && (
          <Footer
            location={location}
            state={FooterState}
            menu={footerMenu}
            profile={userProfile}
            isAuthorized={isAuthorized}
          />
        )}
      </IonApp>
    )
  )
}

App.propTypes = {
  UserInfo: PropTypes.object.isRequired,
  SnackbarInfo: PropTypes.object.isRequired,
  FooterState: PropTypes.object.isRequired,
  EventsInfo: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  actions: PropTypes.shape({
    auth: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    fireEvent: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
    fetchUserInfoLegacy: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    showSnackbar: PropTypes.func.isRequired,
    hideSnackbar: PropTypes.func.isRequired,
    getTasks: PropTypes.func.isRequired,
  }),
}

// App.defaultProps = {
//   auth: () => {},
//   logout: () => {},
//   fireEvent: () => {},
//   fetchUser: () => {},
//   fetchUserInfoLegacy: () => {},
//   updateUser: () => {},
//   setUserProfile: () => {},
//   showSnackbar: () => {},
//   getTasks: () => {},
// }

const mapStateToProps = (state) => ({
  UserInfo: state.UserInfo,
  SnackbarInfo: state.SnackbarInfo,
  FooterState: state.Footer,
  EventsInfo: state.EventsInfo,
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      auth,
      logout,
      fetchUserInfoLegacy,
      fetchUser,
      updateUser,
      setUserProfile,
      showSnackbar,
      hideSnackbar,
      fireEvent,
      getTasks,
      enableProcessing,
      disableProcessing,
    },
    dispatch
  ),
})

export default compose(
  withBodyClassName,
  connect(mapStateToProps, mapDispatchToProps)
)(App)
