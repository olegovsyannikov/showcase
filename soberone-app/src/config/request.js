import js from '../utils/cookies'

export const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${js.cookie('token')}`,
}
