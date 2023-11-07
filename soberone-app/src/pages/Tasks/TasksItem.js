import React, { Component } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { withTranslation } from 'react-i18next'

import global from 'utils/global'
import { putVariablesToText } from 'utils/global/helper'
import {
  getTasksItem,
  updateTasksItem,
  favoriteTasksItem,
} from 'actions/TasksActions'
import {
  showSnackbar,
  hideSnackbar,
} from 'actions/SnackbarActions'
import fireEvent from 'actions/EventsActions'

import Stories from 'components/Stories'
import Article from 'components/Article/Article'
import Accordion from 'components/Accordion/Accordion'
import AccordionItem from 'components/Accordion/AccordionItem'

import OtherAnswers from 'components/OtherAnswers'
import MyAnswers from 'components/MyAnswers'

import { Button, Block, Card, Header, Section } from 'components'

import { userDataSelector } from 'selectors/user'
import { tasksItemSelector } from 'selectors/tasks'

import './TasksItem.styl'

class TasksItem extends Component {
    static contextTypes = {
      router: PropTypes.object.isRequired,
    }

    static propTypes = {
      task: PropTypes.object,
      userData: PropTypes.object,

      SnackbarInfo: PropTypes.object.isRequired,
      match: PropTypes.object.isRequired,

      actions: PropTypes.shape({
        getTasksItem: PropTypes.func.isRequired,
        updateTasksItem: PropTypes.func.isRequired,
        favoriteTasksItem: PropTypes.func.isRequired,
        showSnackbar: PropTypes.func.isRequired,
        hideSnackbar: PropTypes.func.isRequired,
        fireEvent: PropTypes.func.isRequired,
      }),
      t: PropTypes.func.isRequired,
    };

    static defaultProps = {
      task: {
        loading: true,
        loaded: false,
      },
      userData: {},
      actions: {
        getTasksItem: () => {},
        updateTasksItem: () => {},
        favoriteTasksItem: () => {},
        showSnackbar: () => {},
        hideSnackbar: () => {},
        fireEvent: () => {},
      },
    };

    constructor(props) {
      super(props)

      this.sectionRef = React.createRef()
      this.actionButtonRef = React.createRef()
    }

    state = {
      isActionButtonSticky: false,
    }

    componentDidMount() {
      const { router: { history } } = this.context
      const { match: { params: { taskId, mode } }, actions } = this.props

      actions.getTasksItem(taskId, mode).then(res => {
        const { payload: { data: tasksItem, error } } = res

        if (error) {
          history.push('/tasks')
        } else {
          actions.fireEvent('screen_view', {
            screen: 'task',
          })
          actions.fireEvent('screen_task', {
            id: tasksItem.id,
            type: tasksItem.type,
            stage: tasksItem.stage,
            status: tasksItem.status,
            questions_count: (tasksItem.items ? tasksItem.items.length : 0),
            answered_count: (tasksItem.result ? tasksItem.result.length : 0),
          })
        }
      })

      actions.hideSnackbar()

      window.addEventListener('scroll', this.handleScroll, true)
    }

    componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll, true)
    }

    handleScroll = () => {
      const actionButton = this.actionButtonRef.current
      const { isActionButtonSticky } = this.state
      if (actionButton) {
        const isNeedSticky = (actionButton && actionButton.getBoundingClientRect().y < 57)

        // Добавляем sticky position для кнопки при попадании в зону видимости
        if (!isActionButtonSticky && isNeedSticky) {
          this.setState({
            isActionButtonSticky: isNeedSticky,
          })
        }

        // Убираем sticky position у кнопки при выходе из зоны видимости
        if (isActionButtonSticky && !isNeedSticky) {
          this.setState({
            isActionButtonSticky: isNeedSticky,
          })
        }
      }
    }

    scrollTop = () => {
      const ref = this.sectionRef.current
      if (ref) {
        ref.scrollTo(0, 0)
      }
    }

    closeTask = ({ status, isFinished }) => {
      const { actions, t } = this.props

      if (status === 'finished' && isFinished) {
        actions.showSnackbar({ title: t('tasks.item.done') })
      } else {
        actions.showSnackbar({ title: t('tasks.item.notDone') })
      }
    }

    goNext = () => {
      const {
        task: {
          id,
          type,
          stage,
        },
        actions,
        t,
      } = this.props

      actions.updateTasksItem(id, { is_finished: true, status: 'finished' }).then(() => {
        actions.fireEvent('submit_data', {
          data_type: 'task',
        })
        actions.fireEvent('submit_task', {
          id,
          type,
          stage,
          isFinished: 'yes',
        })

        global.gtm.trackEvent(`finished_task_${id}`)

        actions.showSnackbar({ title: t('tasks.item.next') })

        this.scrollTop()
      })
    }

    setActionButtonEvent = () => {
      const { router: { history } } = this.context
      const { task: { items, test_id: testId }, match: { params: { taskId, mode } } } = this.props

      if (testId) {
        history.push(`/tools/tests/${testId}/${taskId}`)
        return
      }

      if (items) {
        if (mode) {
          history.push(`/tasks/${taskId}/perform/${mode}`)
        } else {
          history.push(`/tasks/${taskId}/perform`)
        }
      } else {
        this.goNext()
      }
    }

    getActionButtonText = () => {
      const {
        task: {
          items,
          status,
          test_id: testId,
          is_editable: isEditable,
        },
        t,
      } = this.props

      if (testId) {
        return t('tasks.item.actionButton.test')
      }

      if (items && isEditable) {
        if (status === 'finished') {
          return t('tasks.item.actionButton.edit')
        }

        if (status === 'new' || status === 'seen') {
          return t('tasks.item.actionButton.start')
        }

        return t('tasks.item.actionButton.continue')
      }

      return t('tasks.item.actionButton.next')
    }

    render() {
      const { router: { history } } = this.context
      const {
        match: {
          params: {
            taskId,
            mode,
          },
        },
        actions,
        task: {
          loaded,
          title,
          text,
          intro,
          response,
          stage,
          type,
          image,
          meta,
          items,
          result,
          status,
          is_favorite: isFavorite,
          material_id: materialId,
          material_text: materialText,
          material_meta: materialMeta,
          time_to_do: time,
          other_user_results: otherUserResults,
        },
        SnackbarInfo,
        userData: {
          id,
        },
        t,
      } = this.props

      const { isActionButtonSticky } = this.state

      const isFinished = (status === 'finished')
      const isNew = (status === 'new')

      const showActionButton = loaded

      if (type === 11) {
        return (
          <Stories
            stories={JSON.parse(intro)}
            onAllStoriesEnd={() => {
              if (!isFinished) {
                this.goNext()
              }
              history.goBack()
            }}
          />
        )
      } else {
        return (
          <div className="page">
            <Header
              options={{
                left: {
                  icon: 'back',
                  type: 'click',
                  action: () => {
                    if (isNew) {
                      actions.getTasksItem(taskId, mode)
                    }
                    history.push('/tasks')
                  },
                },
                right: {
                  icon: 'bookmark',
                  type: 'click',
                  active: isFavorite,
                  action: () => actions.favoriteTasksItem(taskId, { isFavorite }).then(
                    () => actions.showSnackbar({ title: isFavorite ? t('tasks.item.favorites.removed') : t('tasks.item.favorites.saved') }),
                  ),
                },
              }}
            />
            <Section
              type="task"
              className={cx(
                {
                  'section--snackbar': SnackbarInfo.visible,
                },
              )}
              ref={this.sectionRef}
            >
              <div className="block block--card">
                <Card
                  type="task"
                  kind="transparent"
                  category={type}
                  title={title}
                  subtitle={materialMeta ? materialMeta.author : null}
                  image={type === 5 ? image : null}
                  stage={stage}
                  meta={{
                    status,
                    time,
                  }}
                />
              </div>
              <div
                className={cx(
                  'task',
                  {
                    [`task--${status}`]: Boolean(status),
                    'task--noaction': !showActionButton,
                  },
                )}
              >
                {isFinished && response && (
                  <div className="task__response">
                    <div className="author task__response-author">
                      <div className="author__avatar">
                        <img
                          src="/assets/images/doctor@2x.png"
                          className="author__img"
                          alt={t('tasks.item.response.name')}
                        />
                      </div>
                      <div className="author__content">
                        <p className="author__name">{t('tasks.item.response.name')}</p>
                        <p className="author__position">{t('tasks.item.response.jobTitle')}</p>
                      </div>
                    </div>
                    <div
                      className="task__response-content"
                      // eslint-disable-next-line
                      dangerouslySetInnerHTML={{ __html: putVariablesToText(response, id) }} />
                  </div>
                )}

                {meta && meta.download && (
                  <div className="task__download">
                    <a
                      className="link link--download"
                      href="{data.meta.download}"
                      target="_blank"
                    >
                      <span className="link__text">{meta.download.replace(/^.*(\\|\/|\\:)/, '')}</span>
                    </a>
                  </div>
                )}

                {intro && (
                  <div className="task__info">
                    <Article
                      className="article"
                      dangerouslySetInnerHTML={{ __html: putVariablesToText(intro, id) }}
                    />
                  </div>
                )}

                {text && (
                  <div className="task__text">
                    <Article
                      className="article"
                      dangerouslySetInnerHTML={{ __html: putVariablesToText(text, id) }}
                    />
                  </div>
                )}

                {materialText && !(isNew || status === 'seen') ? (
                  <div className="task__material">
                    { materialId && materialText && (
                      <Accordion className="accordion accordion--material">
                        <AccordionItem title={t('tasks.item.showArticle')}>
                          <Article
                            className="article article--task"
                            dangerouslySetInnerHTML={{ __html: materialText }}
                          />
                        </AccordionItem>
                      </Accordion>
                    )}
                  </div>
                ) : (materialText && (
                  <div className="task__material">
                    <Article
                      className="article"
                      dangerouslySetInnerHTML={{ __html: materialText }}
                    />
                  </div>
                ))}

                {// Добавляем "Ваши ответы" только для finished или "in_progress"
                  items && items.length > 0 && (isFinished || status === 'in_progress') && (
                    <Block
                      type="my-answers"
                      className="px--lg-m pt--lg-m pb--lg-m mt--lg-m"
                    >
                      <MyAnswers
                        items={items}
                        result={result || undefined}
                      />
                    </Block>
                  )
                }

                {showActionButton && (
                  <div
                    className={cx(
                      'task__action',
                      { 'task__action--sticky': isActionButtonSticky || isFinished },
                    )}
                    ref={this.actionButtonRef}
                  >
                    <Button
                      code="task_action"
                      kind={isFinished ? status : 'primary'}
                      size="l"
                      align="wide"
                      onClick={() => this.setActionButtonEvent()}
                    >
                      {this.getActionButtonText()}
                    </Button>
                  </div>
                )}

                <OtherAnswers
                  data={otherUserResults}
                  items={items}
                />
              </div>
            </Section>
          </div>
        )
      }
    }
}

const mapStateToProps = (state, props) => ({
  userData: userDataSelector(state),
  task: tasksItemSelector(state, { taskId: props.match.params.taskId }),
  SnackbarInfo: state.SnackbarInfo,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    getTasksItem,
    updateTasksItem,
    favoriteTasksItem,
    showSnackbar,
    hideSnackbar,
    fireEvent,
  }, dispatch),
})

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(TasksItem)
