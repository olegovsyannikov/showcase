import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { withTranslation } from 'react-i18next'

import { Avatar, Card, Section, Loader, Button, Icon, Tracker } from 'components'
import Message from 'components/Message/Message'

import fireEvent from 'actions/EventsActions'
import { isDonateSelector } from '../../selectors/user'

import { tasksActiveSelector, tasksLoadingSelector, tasksLoadedSelector } from 'selectors/tasks'

import './Home.styl'

class Home extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    UserInfo: PropTypes.object.isRequired,
    Menu: PropTypes.object.isRequired,
    tasksActive: PropTypes.array,
    isTasksLoading: PropTypes.bool.isRequired,
    isTasksLoaded: PropTypes.bool.isRequired,
    actions: PropTypes.shape({
      fireEvent: PropTypes.func.isRequired,
    }),
    history: PropTypes.object,
    t: PropTypes.func.isRequired,
    isDonate: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    tasksActive: [],
    actions: {
      fireEvent: () => {},
    },
    history: {},
  }

  isLoadingTasks = true

  componentDidMount() {
    const {
      actions,
      // isTasksLoaded,
    } = this.props

    actions.fireEvent('screen_view', {
      screen: 'home',
    })
    actions.fireEvent('screen_home')
  }

  render() {
    const {
      tasksActive,
      isTasksLoading,
      history,
      UserInfo: {
        data: { goal, userpic, is_paid: isPaid },
      },
      Menu: { supportUnreadCount },
      t,
      isDonate,
    } = this.props

    let task
    if (tasksActive) {
      [task] = tasksActive
    }

    let taskList = (
      <div className='block block--items block--home'>
        <div className='block__content'>
          <div className='tasks-loader-container'>
            <Loader type='icon' color='default' iconCenter />
          </div>
        </div>
      </div>
    )

    if (tasksActive && tasksActive.length) {
      taskList = (
        <div className='block block--items block--home'>
          <div className='block__content'>
            {task && (
              <>
                <div className='block__title'>
                  <h4 className='block__title-text'>
                    {t('home.tasks.title')} {t(`tasks.types.${task.type}`)}
                  </h4>
                </div>
                <ul className='list list--tasks'>
                  <li className='list__item' key={task.id}>
                    <Card
                      kind='primary'
                      type='task'
                      category={task.type}
                      stage={task.stage}
                      title={task.title}
                      image={task.image}
                      announce={task.announce}
                      meta={{
                        status: task.status,
                        time: task.time_to_do,
                      }}
                      onClick={() => history.push(`/tasks/${task.id}`)}
                    />
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      )
    } else if (!isTasksLoading) {
      taskList = (
        <div className='task-message-container'>
          <Message type='sleep' title={t('home.done.title')} text={t('home.done.text')} />
        </div>
      )
    }

    return (
      <div className='page'>
        <Section page='home' key='section'>
          <div className='block--home home-header'>
            <div className='home-header__more'>
              <Button
                code='home_more'
                component={NavLink}
                kind='ghost'
                format='icon'
                size='s'
                to='/more'
                data-unread={supportUnreadCount}
              >
                <Icon name='burger' size={22} />
              </Button>
            </div>
            <div className='home-header__main'>
              <div className='home-header__main-label'>{t('home.goal.title')}</div>
              <div className='home-hedaer__main-goal'>{goal > '' ? goal : t('home.goal.value')}</div>
            </div>
            <div className='home-header__user'>
              <Button code='home_user' kind='ghost' format='icon' size='s' component={NavLink} to='/profile/edit'>
                <Avatar image={userpic || undefined} size='m' className='home-header__user-avatar' />
                {isPaid && !isDonate && (
                  <div className='home-header__user-premium'>
                    <Icon name='star' size={13} />
                  </div>
                )}
              </Button>
            </div>
          </div>

          <Tracker />

          {taskList}
        </Section>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  UserInfo: state.UserInfo,
  Menu: state.Menu,
  tasksActive: tasksActiveSelector(state),
  isTasksLoading: tasksLoadingSelector(state),
  isTasksLoaded: tasksLoadedSelector(state),
  isDonate: isDonateSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      fireEvent,
    },
    dispatch
  ),
})

export default compose(withTranslation(), connect(mapStateToProps, mapDispatchToProps))(Home)
