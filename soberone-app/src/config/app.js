export const environment = process.env.REACT_APP_ENVIRONMENT || 'local'

export const apiUrl = process.env.REACT_APP_API_URL || '/api/v1'
export const apiUrlV2 = process.env.REACT_APP_API_URL_V2 || '/api/v2'
export const apiChatUrl = process.env.REACT_APP_API_CHAT_URL || 'http://localhost:3000'
export const centrifugeUrl = process.env.REACT_APP_CENTRIFUGE_URL || 'ws://localhost:8000/connection/websocket'

export const sentryDsn = process.env.REACT_APP_SENTRY_DSN || null

export const apiBlogUrl = process.env.REACT_APP_API_BLOG_URL || null
export const typeformUrl = process.env.REACT_APP_TYPEFORM_URL || null

export const ghostApiKey = process.env.REACT_APP_GHOST_API_KEY || null
export const amplitudeKey = process.env.REACT_APP_AMPLITUDE_KEY || null

export const intercomAppId = process.env.REACT_APP_INTERCOM_APP_ID || null
export const cloudPaymentsId = process.env.REACT_APP_CLOUD_PAYMENTS_ID || null

export const gtmId = process.env.REACT_APP_GTM_ID || null
export const gtmEnvQuery = process.env.REACT_APP_GTM_ENV_QUERY || null
export const gtmAuth = process.env.REACT_APP_GTM_AUTH || null
export const gtmPreview = process.env.REACT_APP_GTM_PREVIEW || null

export const fbPixelId = process.env.REACT_APP_FB_PIXEL_ID || null
export const yandexMetricaId = process.env.REACT_APP_YANDEX_METRICA_ID || null

export const growthbookApiUrl = process.env.REACT_APP_GROWTHBOOK_API_URL || null
export const growthbookApiKey = process.env.REACT_APP_GROWTHBOOK_API_KEY || null

export const mixpanelToken = process.env.REACT_APP_MIXPANEL_TOKEN || null
export const launchdarklyClientToken = process.env.REACT_APP_LAUNCHDARKLY_CLIENT_TOKEN || null
