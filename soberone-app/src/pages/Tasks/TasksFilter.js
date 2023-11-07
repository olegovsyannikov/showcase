import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import serialize from 'form-serialize'
import { compose } from 'recompose'
import { withTranslation } from 'react-i18next'

import { Checkbox, Header, Section } from 'components'

import fireEvent from 'actions/EventsActions'
import { showSnackbar } from 'actions/SnackbarActions'
import { filterTasks } from 'actions/TasksActions'

// import { FormTasksFilter } from 'components/Forms';

import {
  tasksFiltersSelector,
} from 'selectors/tasks'

class TasksFilter extends Component {
  static propTypes = {
    tasksFilters: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      fireEvent: PropTypes.func.isRequired,
      filterTasks: PropTypes.func.isRequired,
      showSnackbar: PropTypes.func.isRequired,
    }),
    history: PropTypes.object,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    actions: {
      fireEvent: () => {},
      showSnackbar: () => {},
    },
    history: {},
  };

  componentDidMount() {
    const {
      tasksFilters: filters,
      actions,
      t,
    } = this.props

    const onCount = filters.type.length

    const offCount = (Object.values(t('tasks.types', { returnObjects: true })).length - filters.type.length)
    actions.fireEvent('modal_view', {
      window: 'tasks_filter',
    })
    actions.fireEvent('modal_tasks_filter', {
      on_count: onCount,
      off_count: offCount,
    })
  }

  sendForm() {
    const {
      actions,
      history,
    } = this.props
    const obj = serialize(this.filtersForm, { hash: true, empty: true })

    Object.keys(obj).map(item => obj[item] = obj[item].filter(x => x).map(x => parseInt(x, 10)))

    actions.fireEvent('filter_apply', {
      filter: 'tasks',
    })
    actions.fireEvent('filter_tasks', obj)

    actions.filterTasks(obj)
    history.push('/tasks')
  }

  render() {
    const {
      tasksFilters: filters,
      t,
    } = this.props

    const headerOptions = {
      shadow: true,
      title: t('tasks.filter.title'),
      left: {
        icon: 'close',
        type: 'link',
        action: '/tasks',
      },
      right: {
        icon: 'check',
        type: 'click',
        action: this.sendForm.bind(this),
      },
    }

    return (
      <div className="page">
        <Header
          key="header"
          options={headerOptions}
        />
        <Section
          key="section"
          type="settings"
        >
          <form
            className="form"
            ref={c => { this.filtersForm = c }}
          >
            <div className="form__block">
              <div className="form__title">
                <h4 className="form__title-text">{t('tasks.filter.typeTitle')}</h4>
              </div>
              {Object.keys(t('tasks.types', { returnObjects: true })).map((type, index) => (
                <Checkbox
                  key={index}
                  defaultChecked={filters.type ? filters.type.indexOf(parseInt(type, 10)) !== -1 : false}
                  id={`type_${type}`}
                  name="type[]"
                  value={type}
                >
                  {t(`tasks.types.${type}`)}
                </Checkbox>
              ))}
            </div>
          </form>
        </Section>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  tasksFilters: tasksFiltersSelector(state),
})

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({
  fireEvent,
  filterTasks,
  showSnackbar,
}, dispatch) })

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(TasksFilter)
