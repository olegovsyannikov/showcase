import { each, isEmpty } from 'lodash'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { withTranslation } from 'react-i18next'

import fireEvent from 'actions/EventsActions'

import {
  getTasksItem,
  updateTasksItem,
} from 'actions/TasksActions'

import { userDataSelector } from 'selectors/user'
import { tasksItemSelector } from 'selectors/tasks'

import OtherAnswers from 'components/OtherAnswers'
import { Section, Block, Loader, Header } from 'components'
import { FormTasksItemPerform } from 'components/Forms'

class TasksItemPerform extends Component {
  static propTypes = {
    userData: PropTypes.object.isRequired,
    task: PropTypes.object,
    match: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      fireEvent: PropTypes.func.isRequired,
      getTasksItem: PropTypes.func.isRequired,
      updateTasksItem: PropTypes.func.isRequired,
    }),
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    task: {
      loading: true,
    },
    actions: {
      fireEvent: () => {},
    },
  };

  state = {
    autosave: false,
  }

  componentDidMount() {
    const { actions, task: { loading }, match: { params: { taskId, mode } } } = this.props
    if (loading) {
      actions.getTasksItem(taskId, mode).then(() => {
        this.sendOpenTaskEvents()
      })
    } else {
      this.sendOpenTaskEvents()
    }
  }

  componentWillUnmount() {
    const {
      actions,
      match: {
        params: {
          taskId,
        },
      },
      task: {
        is_finished: isFinished,
        status,
      },
    } = this.props

    if (!isFinished && status !== 'in_progress') {
    // Этот запрос нужен только для того, чтобы изменить статус на in progress при открытии/закрытии формы выполнения
      actions.updateTasksItem(taskId, { status: 'in_progress' })
    }
  }

  isAutoSaved = autosave => this.setState({ autosave });

  sendOpenTaskEvents() {
    const {
      actions,
      task: {
        test_id: testId,
      },
      match: {
        params: {
          taskId,
        },
      },
    } = this.props

    if (testId) {
      actions.fireEvent('modal_view', {
        window: 'test_answer',
      })
      actions.fireEvent('modal_test_answer', { id: testId })
    } else {
      actions.fireEvent('modal_view', {
        window: 'task_answer',
      })

      actions.fireEvent('modal_task_answer', { id: taskId })
    }
  }

  render() {
    const {
      task,
      task: {
        loading,
        items,
        result: taskResult,
        show_my_answers: showMyAnswers,
        show_other_answers: showOtherAnswers,
      },
      match: {
        params: {
          taskId,
        },
      },
      userData: {
        id: userId,
        allow_task_result_publication: allowTaskResultPublication,
      },
      t,
    } = this.props

    const { autosave } = this.state

    const isShowMyAnswers = Boolean([
      showOtherAnswers,
      showMyAnswers,
      allowTaskResultPublication
    ].find(i => i !== null))

    if (loading) {
      return <Loader />
    }

    const result = taskResult || {}

    // Задаем дефолтные значения для каждого ответа
    if (isEmpty(taskResult)) {
      each(items, question => {
        result[question.id] = ''
      })
    }

    return (
      <div className="page">
        <Header
          options={{
            shadow: true,
            titleSmall: autosave ? t('tasks.item.perform.draftSaved') : null,
            left: {
              icon: 'close',
              type: 'link',
              action: `/tasks/${taskId}`,
            },
          }}
        />
        <Section type="edit">
          <Block color="white">
            <FormTasksItemPerform
              isAutoSaved={this.isAutoSaved}
              userId={userId}
              data={task}
              initialValues={{
                show_my_answers: isShowMyAnswers,
                final_save: false,
                result,
              }}
            />
            <OtherAnswers
              data={task.other_user_results}
              items={task.items}
            />
          </Block>
        </Section>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  userData: userDataSelector(state),
  task: tasksItemSelector(state, { taskId: props.match.params.taskId }),
})

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({
  fireEvent,
  getTasksItem,
  updateTasksItem,
}, dispatch) })

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(TasksItemPerform)
