import {
  FETCHING_TEST_LIST,
  FETCHED_TEST_LIST,
  FETCH_TEST_LIST_FAIL,
  FETCHING_TEST_DETAILS,
  FETCHED_TEST_DETAILS,
  FETCH_TEST_DETAILS_FAIL,
} from '../constants/tests'

export function TestList(state = {
  isLoading: false,
  data: null,
  error: null,
}, {
  type,
  payload,
}) {
  switch (type) {
    case FETCHING_TEST_LIST:
      return {
        isLoading: true,
        error: null,
        data: payload.stateData,
      }
    case FETCHED_TEST_LIST:
      return {
        isLoading: false,
        error: null,
        data: payload.data,
      }
    case FETCH_TEST_LIST_FAIL:
      return {
        isLoading: false,
        data: null,
        error: payload.error,
      }
    default:
      return state
  }
}

export function TestDetails(state = {
  isLoading: false,
  data: null,
  error: null,
}, {
  type,
  payload,
}) {
  switch (type) {
    case FETCHING_TEST_DETAILS:
      return {
        ...state,
        isLoading: true,
        data: null,
        error: null,
      }
    case FETCHED_TEST_DETAILS:
      return {
        ...state,
        isLoading: false,
        error: null,
        data: payload.data,
      }
    case FETCH_TEST_DETAILS_FAIL:
      return {
        ...state,
        isLoading: false,
        data: null,
        error: payload.error,
      }
    default:
      return state
  }
}
