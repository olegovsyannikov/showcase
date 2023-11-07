import {
  apiUrl,
  apiUrlV2,
  apiChatUrl,
  centrifugeUrl,
  sentryDsn,
} from '../config/app'

export const API_URL = apiUrl
export const API_URL_V2 = apiUrlV2
export const API_CHAT_URL = apiChatUrl
export const API_CENTRIFUGE_URL = centrifugeUrl
export const SENTRY_DSN = sentryDsn

export const API_AUTH = '/auth'
export const API_DIARY = '/diary'
export const API_PAYMENTS = '/payment'
export const API_MATERIALS = '/materials'
export const API_TASKS = '/tasks'
export const API_TESTS = '/tests'
export const API_PASSWORD_REMINDER = '/forgot_password'
