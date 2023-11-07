import { TYPE_SET_TOKEN, TYPE_SET_USER } from './types'

export const setToken = (token) => ({
  type: TYPE_SET_TOKEN,
  token: token,
})

export const setUser = (user) => ({
  type: TYPE_SET_USER,
  user: user,
})
