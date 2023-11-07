const isAuthorizedChecker = ({ isAuthorized }) => isAuthorized === true
const isNotRegisteredChecker = ({ isAuthorized, userInfo }) => (
  isAuthorized !== true || (!userInfo.email && !userInfo.has_social_profile)
)

const routes = [
  { path: '/', exact: true, component: 'Home', enabled: isAuthorizedChecker },
  { path: '/welcome', exact: true, component: 'Intro', enabled: isNotRegisteredChecker },
  { path: '/auth', exact: true, component: 'Auth', animation: 'slide--left', enabled: () => true },
  { path: '/t/:jwtToken', exact: true, component: 'Auth', enabled: () => true },
  { path: '/recovery', exact: true, component: 'Recovery', animation: 'slide--left', enabled: () => true },
  { path: '/register', exact: true, component: 'Register', animation: 'slide--left', enabled: () => true },
  { path: '/confirm/:confirmationToken', exact: true, component: 'Confirm', enabled: () => true },
  { path: '/more', exact: true, component: 'More', animation: 'slide--right', enabled: isAuthorizedChecker },

  { path: '/blog', exact: false, component: 'Blog', enabled: isAuthorizedChecker },

  { path: '/profile', exact: true, component: 'Profile', enabled: isAuthorizedChecker },
  { path: '/profile/edit', exact: true, component: 'ProfileEdit', animation: 'slide--left', enabled: isAuthorizedChecker },
  { path: '/profile/settings', exact: true, component: 'ProfileSettings', animation: 'slide--left', enabled: isAuthorizedChecker },
  { path: '/profile/payments', exact: true, component: 'ProfilePayments', animation: 'slide--left', enabled: isAuthorizedChecker },

  { path: '/profile/payments/:authMethod/:tariffId/:price?', exact: false, component: 'ProfilePayments', enabled: () => true },
  { path: '/cpayment/:token/:tariffId/:months/:price', exact: true, component: 'Cpayment', enabled: () => true },

  { path: '/tasks', exact: true, component: 'TasksList', enabled: isAuthorizedChecker },
  { path: '/tasks/filter', exact: true, component: 'TasksFilter', animation: 'slide--left', enabled: isAuthorizedChecker },
  { path: '/tasks/:taskId/:mode(view)?', exact: true, component: 'TasksItem', animation: 'slide--up', enabled: isAuthorizedChecker },
  { path: '/tasks/:taskId/perform/:mode(view)?', exact: true, component: 'TasksItemPerform', animation: 'slide--left', enabled: isAuthorizedChecker },

  { path: '/materials', exact: true, component: 'MaterialsList', enabled: isAuthorizedChecker },
  { path: '/materials/filter', exact: true, component: 'MaterialsFilter', enabled: isAuthorizedChecker },
  { path: '/materials/:materialId', exact: false, component: 'MaterialsItem', enabled: isAuthorizedChecker },

  { path: '/tools', exact: true, component: 'Tools', enabled: isAuthorizedChecker },
  { path: '/tools/diary', exact: true, component: 'Diary', enabled: isAuthorizedChecker },
  { path: '/tools/diary/filter', exact: true, component: 'DiaryFilter', animation: 'slide--left', enabled: isAuthorizedChecker },
  { path: '/tools/diary/add/:diaryDate?', exact: true, component: 'DiaryItem', animation: 'slide--up', enabled: isAuthorizedChecker },
  { path: '/tools/diary/add/:diaryTracker/:diaryDate', exact: true, component: 'DiaryItem', animation: 'slide--up', enabled: isAuthorizedChecker },
  { path: '/tools/diary/edit/:diaryId', exact: false, component: 'DiaryItem', animation: 'slide--up', enabled: isAuthorizedChecker },

  { path: '/tools/tests', exact: true, component: 'TestList', enabled: isAuthorizedChecker },
  { path: '/tools/tests/:testId/:taskId?', exact: false, component: 'TestDetails', animation: 'slide--up', enabled: isAuthorizedChecker },

  { path: '/premium/:promoId?', exact: true, component: 'Premium', animation: 'slide--up', enabled: isAuthorizedChecker },
  { path: '/helpus', exact: true, component: 'HelpUs', animation: 'slide--up', enabled: isAuthorizedChecker },

  { path: '/404', exact: true, component: 'NotFoundPage', enabled: () => true },
]

export default routes
