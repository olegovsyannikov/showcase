import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose } from 'recompose'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import cx from 'classnames'
import Moment from 'moment'

import { getDiary } from 'actions/DiaryActions'
import fireEvent from 'actions/EventsActions'

import {
  diaryLoadingSelector,
  diaryLoadedSelector,
  diarySelector,
} from 'selectors/diary'

import {
  DiaryStats,
  DiaryListItem,
  Button,
  Icon,
} from 'components'
import TrackerControl from './TrackerControl'

import { groupByDays } from '../../utils/global/helper'

import './Tracker.styl'

class Tracker extends React.Component {
  static propTypes = {
    diary: PropTypes.array.isRequired,
    isDiaryLoaded: PropTypes.bool.isRequired,
    actions: PropTypes.shape({
      getDiary: PropTypes.func.isRequired,
      fireEvent: PropTypes.func.isRequired,
    }),
  };

  static defaultProps = {
    actions: {},
  };

  constructor(props) {
    super(props)

    this.state = {
      selectedDate: Moment(new Date()),
      start: Moment(new Date()).subtract(6, 'days'),
      end: Moment(new Date()),
    }
  }

  componentDidMount() {
    const {
      actions,
      isDiaryLoaded,
    } = this.props

    if (!isDiaryLoaded) {
      actions.getDiary({
        count: 30,
      })
    }
  }

  changeDay(day) {
    const { selectedDate } = this.state
    this.setState({ previousDate: selectedDate })
    this.setState({ selectedDate: day })
  }

  render() {
    const {
      diary,
    } = this.props

    const {
      previousDate,
      selectedDate,
      start,
      end,
    } = this.state

    const diaryDataForStats = groupByDays(diary, { from: Moment(end).subtract(60, 'days'), to: end })
    const diaryStats = diaryDataForStats ? DiaryStats({ data: diaryDataForStats }) : null
    const dailyTip = diaryStats.dailyTips[Math.floor(Math.random() * diaryStats.dailyTips.length)]

    const diaryByDays = groupByDays(diary, { from: start, to: end })
    const diaryItem = diaryByDays[selectedDate.format('YYYY-MM-DD')] ? diaryByDays[selectedDate.format('YYYY-MM-DD')][0] : null
    const animationClassNames = selectedDate > previousDate ? 'slide--forward' : 'slide--backward'

    return (
      <>
        <div className="calendar calendar--home">
          {Object.keys(diaryByDays).map(day => {
            const mergedClassName = cx(
              'calendar__item-date',
              {
                'calendar__item-date--today': day === selectedDate.format('YYYY-MM-DD'),
                'calendar__item-date--yes': diaryByDays[day] && diaryByDays[day][0].tracker > 0,
                'calendar__item-date--no': diaryByDays[day] && diaryByDays[day][0].tracker < 1,
              },
            )
            return (
              <div
                key={day}
                className="calendar__item"
              >
                <div className="calendar__item-day">{Moment(day).format('ddd')}</div>
                <Button
                  code="tracker_day"
                  kind="ghost"
                  format="icon"
                  size="s"
                  className={mergedClassName}
                  onClick={() => this.changeDay(Moment(day))}
                >
                  {Moment(day).format('D')}
                </Button>
              </div>
            )
          })}
        </div>
        <div className="week-summary">
          <Icon
            name="alco"
            size={18}
            className="week-summary__icon"
          />
          {dailyTip}
        </div>
        <div className="tracker">
          <div className="tracker__content">
            <TransitionGroup
              childFactory={child => React.cloneElement(child, {
                classNames: animationClassNames,
              })}
            >
              {diaryItem ? (
                <CSSTransition
                  in
                  appear
                  timeout={200}
                  classNames={animationClassNames}
                  key={diaryItem.id}
                >
                  <div className="tracker__diary">
                    <div className="tracker__diary-content">
                      <NavLink
                        className="tracker__diary-link"
                        to={`/tools/diary/edit/${diaryItem.id}`}
                      >
                        <DiaryListItem
                          type="tracker"
                          item={diaryItem}
                        />
                      </NavLink>
                    </div>
                  </div>
                </CSSTransition>
              ) : (
                <CSSTransition
                  in
                  appear
                  timeout={300}
                  classNames={animationClassNames}
                  key={`trackerControl_${selectedDate}`}
                >
                  <TrackerControl
                    className="tracker__control"
                    date={selectedDate}
                  />
                </CSSTransition>
              )}
            </TransitionGroup>
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = state => ({
  isDiaryLoading: diaryLoadingSelector(state),
  isDiaryLoaded: diaryLoadedSelector(state),
  diary: diarySelector(state),
})

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({
  getDiary,
  fireEvent,
}, dispatch) })

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Tracker)
