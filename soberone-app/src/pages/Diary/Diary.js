import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { orderBy } from 'lodash'
import { compose } from 'recompose'
import { withTranslation } from 'react-i18next'

import { NavLink } from 'react-router-dom'
import Moment from 'moment'

import { getDiary } from 'actions/DiaryActions'
import fireEvent from 'actions/EventsActions'
import Message from 'components/Message/Message'
import Chart from 'components/Chart/Chart'
import PanelSobrietyProgress from 'components/Panel/PanelSobrietyProgress'
import {
  DiaryListItem,
  Loader,
  Header,
  Section,
  Button,
  Icon,
} from 'components'

import './Diary.styl'

import {
  diaryLoadingSelector,
  diaryLoadedSelector,
  diarySelector,
  diaryFiltersSelector,
} from 'selectors/diary'

class Diary extends Component {
    static propTypes = {
      UserInfo: PropTypes.object.isRequired,
      diary: PropTypes.array.isRequired,
      diaryFilters: PropTypes.object.isRequired,
      isDiaryLoading: PropTypes.bool.isRequired,
      isDiaryLoaded: PropTypes.bool.isRequired,
      actions: PropTypes.shape({
        fireEvent: PropTypes.func.isRequired,
        getDiary: PropTypes.func.isRequired,
      }),
      t: PropTypes.func.isRequired,
    };

    static defaultProps = {
      actions: {
        getDiary: () => {},
        fireEvent: () => {},
      },
    };

    constructor(props) {
      super(props)

      this.state = {
        period: {
          from: Moment().subtract(31, 'd').format('YYYY-MM-DD'),
          to: Moment().format('YYYY-MM-DD'),
        },
      }
    }

    componentDidMount() {
      const {
        diaryFilters: {
          rating,
        },
        actions,
        isDiaryLoaded,
      } = this.props

      if (!isDiaryLoaded) {
        actions.getDiary({
          rating,
          count: 30,
        })
      }
    }

    render() {
      const {
        UserInfo: { data: userData },
        diary,
        diaryFilters: {
          rating: activeRatingsFilter,
        },
        isDiaryLoading,
        t,
      } = this.props

      const {
        sobriety_started_at: sobrietyStartedAt,
      } = userData

      const {
        period: {
          from,
          to,
        },
      } = this.state

      const data = orderBy(diary, [
        item => (item.timestamp),
        item => (item.id),
      ], ['desc', 'desc'])

      const headerOptions = {
        type: 'large',
        shadow: false,
        title: t('diary.title'),
        screen: 'diary',
        right: {
          icon: 'filter',
          type: 'link',
          action: '/tools/diary/filter',
        },
      }

      let diaryDisplayMode
      if (data && Array.isArray(data) && data.length) {
        diaryDisplayMode = 'show'
      } else if (activeRatingsFilter && activeRatingsFilter.length < 7) {
        diaryDisplayMode = 'filters'
      } else {
        diaryDisplayMode = 'no_items'
      }

      const today = Moment(new Date()).format('YYYY-MM-DD')
      const addButtonUrl = `/tools/diary/add/${today}`

      return (
        <div className="page">
          <Header
            key="header"
            options={headerOptions}
          />
          <Section
            key="section"
            type="analysis"
          >
            <div className="display--initial">
              <>
                <div className="block block--chart">
                  {!isDiaryLoading && (
                    <Chart
                      info={data}
                      type="home"
                      params={{ from, to }}
                    />
                  )}
                </div>
                {sobrietyStartedAt && (
                  <PanelSobrietyProgress date={sobrietyStartedAt} />
                )}
                {isDiaryLoading && (
                  <Loader />
                )}
                {!isDiaryLoading && diaryDisplayMode === 'show' && ([
                  <div
                    className="block block--timeline"
                    key="diary-list"
                  >
                    <ul className="list list--timeline">
                      {data.map(item => (
                        <li
                          className="list__item"
                          key={item.id}
                        >
                          <DiaryListItem item={item} />
                        </li>
                      ))}
                    </ul>
                  </div>,
                ])}
                {!isDiaryLoading && diaryDisplayMode === 'filters' && (
                  <Message
                    type="empty"
                    title={t('messages.diary.filter.title')}
                    text={t('messages.diary.filter.text')}
                  />
                )}
                {!isDiaryLoading && diaryDisplayMode === 'no_items' && (
                  <Message
                    type="empty"
                    title={t('messages.diary.empty.title')}
                    text={t('messages.diary.empty.text')}
                  />
                )}
              </>
            </div>
          </Section>
          <div
            key="diary-action"
            className="diary__action"
          >
            <Button
              code="diary_add"
              component={NavLink}
              kind="primary"
              format="icon"
              size="l"
              to={addButtonUrl}
            >
              <Icon
                name="add"
                size={24}
              />
            </Button>
          </div>
        </div>
      )
    }
}

const mapStateToProps = state => ({
  UserInfo: state.UserInfo,
  isDiaryLoading: diaryLoadingSelector(state),
  isDiaryLoaded: diaryLoadedSelector(state),
  diaryFilters: diaryFiltersSelector(state),
  diary: diarySelector(state),
})

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({
  getDiary,
  fireEvent,
}, dispatch) })

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(Diary)
