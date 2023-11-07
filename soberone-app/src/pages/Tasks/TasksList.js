import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { withTranslation } from 'react-i18next'
import { IonContent, IonRefresher, IonRefresherContent } from '@ionic/react'

import { Icon } from 'components'
// import { IonRefresher, IonRefresherContent } from '@ionic/react'

import Header from 'components/Header/Header'
import Message from 'components/Message/Message'

import { Card, Section, Loader, Tabs, TabsItem } from 'components'

import './TasksList.styl'

import { userDataSelector } from 'selectors/user'

import {
  tasksLoadingSelector,
  tasksLoadedSelector,
  tasksActiveSelector,
  tasksFinishedSelector,
  tasksFavoriteSelector,
  tasksFiltersSelector,
} from 'selectors/tasks'

import { getTasks } from 'actions/TasksActions'
import fireEvent from 'actions/EventsActions'

import i18n from '../../i18n'

class TasksList extends Component {
  static propTypes = {
    userData: PropTypes.object.isRequired,
    isTasksLoading: PropTypes.bool.isRequired,
    isTasksLoaded: PropTypes.bool.isRequired,
    tasksActive: PropTypes.array,
    tasksFinished: PropTypes.array,
    tasksFavorite: PropTypes.array,
    tasksFilters: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      fireEvent: PropTypes.func.isRequired,
      getTasks: PropTypes.func.isRequired,
    }),
    history: PropTypes.object,
    t: PropTypes.func.isRequired,
  }

  static defaultProps = {
    tasksActive: [],
    tasksFinished: [],
    tasksFavorite: [],
    actions: {
      fireEvent: () => {},
      getTasks: () => {},
    },
    history: {},
  }

  state = {
    activeTab: localStorage.getItem('task_active_tab') ? parseInt(localStorage.getItem('task_active_tab'), 10) : 0,
  }

  componentDidMount() {
    const { activeTab } = this.state

    this.fireChangeTabEvent(activeTab)
  }

  setActiveTab(index) {
    localStorage.setItem('task_active_tab', index)
    this.setState({ activeTab: index })

    this.fireChangeTabEvent(index)
  }

  roadmap() {
    const {
      userData: { is_paid: isPaid },
      t
    } = this.props

    return (
      isPaid && i18n.language === 'ru' && (
        <div className='roadmap-link'>
          <NavLink
            className='roadmap-link__link'
            to=''
            onClick={(e) => {
              const newWindow = window.open(
                'https://www.soberone.ru/about/science-behind-sober-one',
                '_blank',
                'noopener,noreferrer'
              )
              if (newWindow) newWindow.opener = null
              e.preventDefault()
            }}
          >
            {t('tasks.list.roadMap')}
            <div className='roadmap-link__icon'>
              <Icon name='star' size={13} />
            </div>
          </NavLink>
        </div>
      )
    )
  }

  getTaskActiveContent({ tasksActive, activeTypes, activeStages, isTasksLoading }) {
    const { t } = this.props

    if (isTasksLoading) {
      return (
        <div className='block'>
          <Loader />
        </div>
      )
    }

    tasksActive.sort((a, b) => {
      if (a.assigned_at === b.assigned_at) {
        return a.assigned_id > b.assigned_id ? 1 : -1
      }
      return a.finished_at < b.finished_at ? -1 : 1
    })

    if (tasksActive.length > 0) {
      return (
        <div className='block block--items' key='active'>
          <div className='block__title'>
            {this.roadmap()}
            <h4 className='block__title-text'>{t('tasks.list.activeTitle')}</h4>
          </div>
          {this.renderList(tasksActive)}
        </div>
      )
    }

    if ((activeTypes && activeTypes.length !== 11) || (activeStages && activeStages.length !== 5)) {
      return (
        <>
          <Message type='empty' title={t('messages.tasks.filter.title')} text={t('messages.tasks.filter.text')} />
          {this.roadmap()}
        </>
      )
    }

    return (
      <>
        <Message type='sleep' title={t('messages.tasks.done.title')} text={t('messages.tasks.done.text')} />
        {this.roadmap(true)}
      </>
    )
  }

  getTasksFinishedContent({ tasksFinished, finishedTasksCount, isTasksLoading }) {
    const { t } = this.props

    if (isTasksLoading) {
      return (
        <div className='block'>
          <Loader />
        </div>
      )
    }

    tasksFinished.sort((a, b) => {
      if (a.finished_at === b.finished_at) return 0

      return a.finished_at < b.finished_at ? -1 : 1
    })

    if (tasksFinished.length > 0) {
      return (
        <div className='block block--items block--tasks block--finished' key='finished'>
          <div className='block__title'>
            <h4 className='block__title-text'>{t('tasks.list.completedTitle', { count: finishedTasksCount })}</h4>
          </div>
          {this.renderList(tasksFinished, true)}
        </div>
      )
    }

    return null
  }

  getTasksFavoriteContent({ tasksFavorite, isTasksLoading }) {
    const { t } = this.props

    if (isTasksLoading) {
      return (
        <div className='block'>
          <Loader />
        </div>
      )
    }

    if (tasksFavorite.length > 0) {
      return (
        <div className='block block--items' key='favorites'>
          {this.renderList(tasksFavorite, true)}
        </div>
      )
    }

    // TODO: fix
    // if (false) {
    //   return <Message type={MESSAGE_TYPES.FILTERS} />;
    // }

    return (
      <Message type='sleep' title={t('messages.tasks.favorites.title')} text={t('messages.tasks.favorites.text')} />
    )
  }

  getHeaderOptions() {
    const { t } = this.props

    return {
      type: 'large',
      screen: 'tasks',
      shadow: false,
      title: t('tasks.list.title'),
      right: {
        icon: 'filter',
        type: 'link',
        action: '/tasks/filter',
      },
    }
  }

  fireChangeTabEvent(activeTab) {
    const { tasksActive, tasksFinished, actions } = this.props

    if (activeTab === 0) {
      // active
      actions.fireEvent('screen_tasks_list', { tab: 'active', count: tasksActive.length })
    } else {
      // finished
      actions.fireEvent('screen_tasks_list', { tab: 'finished', count: tasksFinished.length })
    }
  }

  renderList(content, isOrderReverse) {
    const {
      tasksFilters: { type: activeTypes },
      // actions,
      history,
      t,
    } = this.props

    const activeContent = content.filter((obj) => activeTypes.includes(obj.type))

    const data = isOrderReverse ? activeContent.reverse() : activeContent

    // const doRefresh = event => {
    //   getTasks().then(() => event.detail.complete())
    // }

    return (
      <>
        {data.length > 0 && (
          <ul className='list list--tasks' style={{ paddingBottom: '30px' }}>
            {data.map((task) => (
              <li className='list__item' key={task.id}>
                <Card
                  kind={task.type === 11 ? 'overlay' : 'primary'}
                  type='task'
                  stage={task.stage}
                  category={task.type}
                  title={task.title}
                  subtitle={t(`tasks.types.${task.type}`)}
                  image={task.image}
                  announce={task.announce}
                  meta={{
                    status: task.status,
                    time: task.status !== 'finished' ? task.time_to_do : null,
                  }}
                  onClick={() => history.push(`/tasks/${task.id}`)}
                />
              </li>
            ))}
          </ul>
        )}
      </>
    )
  }

  render() {
    const {
      isTasksLoading,
      tasksActive,
      tasksFinished,
      tasksFavorite,
      tasksFilters: { stage: activeStages, type: activeTypes },
      userData: { finished_tasks: finishedTasksCount },
      actions,
      t,
    } = this.props

    const { activeTab } = this.state

    // Активные задания
    const tasksActiveContent = this.getTaskActiveContent({ tasksActive, activeTypes, activeStages, isTasksLoading })

    // Выполненные задания
    const tasksFinishedContent = this.getTasksFinishedContent({ tasksFinished, finishedTasksCount, isTasksLoading })

    // Избранные задания
    const tasksFavoriteContent = this.getTasksFavoriteContent({ tasksFavorite, isTasksLoading })

    return (
      <div className='page'>
        <Header key='header' options={this.getHeaderOptions()} />
        <Section key='section' type='tasks'>
          <Tabs selected={activeTab} setActiveTab={(index) => this.setActiveTab(index)}>
            <TabsItem
              type='tasks'
              label={t('tasks.list.feedTitle')}
              count={tasksActive.length}
              fireEvent={actions.fireEvent}
            >
              <IonContent>
                <IonRefresher
                  slot='fixed'
                  onIonRefresh={(e) => {
                    e.detail.complete()
                    actions.getTasks()
                  }}
                >
                  <IonRefresherContent />
                </IonRefresher>

                {tasksActiveContent}
                {tasksFinishedContent}
              </IonContent>
            </TabsItem>
            <TabsItem type='tasks' label={t('tasks.list.favoritesTitle')} count={0} fireEvent={actions.fireEvent}>
              {tasksFavoriteContent}
            </TabsItem>
          </Tabs>
        </Section>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  userData: userDataSelector(state),
  isTasksLoading: tasksLoadingSelector(state),
  isTasksLoaded: tasksLoadedSelector(state),
  tasksFilters: tasksFiltersSelector(state),
  tasksActive: tasksActiveSelector(state),
  tasksFinished: tasksFinishedSelector(state),
  tasksFavorite: tasksFavoriteSelector(state),
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      getTasks,
      fireEvent,
    },
    dispatch
  ),
})

export default compose(withTranslation(), connect(mapStateToProps, mapDispatchToProps))(TasksList)
