import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { reducer as formReducer } from 'redux-form'
import Tasks from './tasks'
import { TestList, TestDetails } from './tests'
import Diary from './diary'
import UserInfo from './user'
import Payment from './payments'
import SnackbarInfo from './snackbar'
import EventsInfo from './events'
import Footer from './footer'
import Menu from './menu'

const createRootReducer = history => combineReducers({
  router: connectRouter(history),
  form: formReducer,
  SnackbarInfo,
  Footer,
  Menu,
  EventsInfo,
  UserInfo,
  Tasks,
  TestList,
  TestDetails,
  Diary,
  Payment,
})

export default createRootReducer
