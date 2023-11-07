import React, { useState } from 'react'
import { pick, mapKeys } from 'lodash'
import { GTMProvider, useGTMDispatch } from '@elgorditosalsero/react-gtm-hook'
// import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react'
// import { withLDProvider } from 'launchdarkly-react-client-sdk'
// import mixpanel from 'mixpanel-browser'

// import { gtmId, gtmAuth, gtmPreview, environment, launchdarklyClientToken } from '../config/app'
import { gtmId, gtmAuth, gtmPreview, environment } from '../config/app'

// function createDOMScript(src, onError = null, onLoad = null) {
//   const script = document.createElement('script')
//   script.type = 'text/javascript'
//   if (onError) script.onerror = (event) => onError(event)
//   if (onLoad) script.onload = () => onLoad()
//   script.src = src
//   script.async = true
//   document.head.appendChild(script)
// }

// window.GROWTHBOOK_CONFIG = {
//   trackingCallback: (experiment, result) => {
//     mixpanel.track('$experiment_started', {
//       'Experiment name': experiment.key,
//       'Variant name': result.variationId,
//     })
//   },
// }
// const growthbook = new GrowthBook(window.GROWTHBOOK_CONFIG)

const GTM_UPDATE_USER_ATTRIBUTES = 'UpdateUserAttributes'
const GTM_SHOW_INTERCOM_CHAT = 'ShowSupportChat'

const createS1Attributes = (user) => {
  const attrs = pick(user, [
    'status',
    'city',
    'telegram',
    'stage',
    'group',
    'internal_comment',
    'sobriety_started_at',
    'is_chat_available',
    'new_tasks',
    'in_progress_tasks',
    'finished_stage_tasks',
    'finished_tasks',
    'stage_tasks',
    'is_paid',
    'payments_amount',
    'payments_quantity',
    'recurring_subscription',
    'tariff_plan',
    'split_test_code',
    'goal',
    'language',
  ])

  attrs.admin = `http://admin2.sober/user/view?id=${user.id}`
  attrs.has_userpic = user.userpic ? 1 : 0
  attrs.birthdate_at = user.birthdate
  attrs.subscription_end_at = user.paid_until

  return mapKeys(attrs, (v, k) => `s1_${k}`)
}

export const useAnalytics = () => {
  const sendDataToGTM = useGTMDispatch()

  const sendEvent = (event, attributes) => {
    sendDataToGTM({
      event,
      eventProperties: attributes,
      environment,
    })

    // mixpanel.track('$' + event, attributes)
  }

  const identify = (user) => {
    if (user && user.id) {
      const basicAttributes = {
        user_id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
        last_login: new Date(),
      }
      const customAttributes = createS1Attributes(user)

      sendDataToGTM({
        event: GTM_UPDATE_USER_ATTRIBUTES,
        userProperties: { basicAttributes, customAttributes },
        environment,
      })

      // if (mixpanel.config.token) {
      //   mixpanel.identify(String(user.id))
      //   mixpanel.people.set({ ...basicAttributes, ...customAttributes })
      // }

      // growthbook.setAttributes({
      //   ...growthbook.getAttributes(),
      //   ...basicAttributes,
      //   ...customAttributes,
      // })
    }
  }

  const showSupportChat = (cb = undefined) => {
    sendDataToGTM({
      event: GTM_SHOW_INTERCOM_CHAT,
      environment,
    })

    if (cb) cb()
  }

  return { sendEvent, identify, showSupportChat }
}

// eslint-disable-next-line react/prop-types
export const AnalyticsProvider = ({ children }) => {
  const [gtmConfig] = useState({
    id: gtmId,
    environment: {
      gtm_auth: gtmAuth,
      gtm_preview: gtmPreview,
    },
  })

  // createDOMScript(`${growthbookApiUrl}/js/${growthbookApiKey}.js`)

  // useLayoutEffect(() => {
  //   const fetchGrowthbook = async () => {
  //     const { features } = await (await fetch(`${growthbookApiUrl}/api/features/${growthbookApiKey}`)).json()
  //     if (features) growthbook.setFeatures(features)
  //   }
  //   fetchGrowthbook()

  //   mixpanel.init(mixpanelToken, {
  //     loaded: function (mixpanel) {
  //       growthbook.setAttributes({
  //         ...growthbook.getAttributes(),
  //         id: mixpanel.get_distinct_id(),
  //         deviceId: mixpanel.get_distinct_id(),
  //       })
  //     },
  //     ignore_dnt: true,
  //     debug: environment !== 'production',
  //   })
  // }, []) // eslint-disable-line

  return (
    <GTMProvider state={gtmConfig}>
      {children}
      {/* <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider> */}
    </GTMProvider>
  )
}

// export const AnalyticsProvider = withLDProvider({
//   clientSideID: launchdarklyClientToken,
// })(AnalyticsProviderInternal)
