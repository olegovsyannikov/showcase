import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import serialize from 'form-serialize'
import { compose } from 'recompose'
import { withTranslation } from 'react-i18next'

import { Checkbox, Header, Section } from 'components'

import fireEvent from 'actions/EventsActions'
import { filterDiary } from 'actions/DiaryActions'

import {
  diaryFiltersSelector,
} from 'selectors/diary'

class DiaryFilter extends Component {
  static propTypes = {
    diaryFilters: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      fireEvent: PropTypes.func.isRequired,
      filterDiary: PropTypes.func.isRequired,
    }),
    history: PropTypes.object,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    actions: {
      fireEvent: () => {},
    },
    history: {},
  };

  componentDidMount() {
    const {
      diaryFilters: filters,
      actions,
      t,
    } = this.props

    const onCount = filters.rating.length
    const offCount = (Object.values(t('diary.ratings', { returnObjects: true })).length - onCount)

    actions.fireEvent('modal_view', {
      window: 'diary_filter',
    })
    actions.fireEvent('modal_diary_filter', {
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
      filter: 'diary',
    })
    actions.fireEvent('filter_diary', obj)

    actions.filterDiary(obj)
    history.push('/tools/diary')
  }

  render() {
    const {
      diaryFilters: filters,
      t,
    } = this.props

    const headerOptions = {
      shadow: true,
      title: t('diary.filter.title'),
      left: {
        icon: 'close',
        type: 'link',
        action: '/tools/diary',
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
                <h4 className="form__title-text">{t('diary.filter.ratingTitle')}</h4>
              </div>
              {Object.keys(t('diary.ratings', { returnObjects: true })).map((rating, index) => (
                <Checkbox
                  key={index}
                  defaultChecked={filters.rating ? filters.rating.indexOf(parseInt(rating, 10)) !== -1 : false}
                  id={`type_${rating}`}
                  name="rating[]"
                  value={rating}
                >
                  {t(`diary.ratings.${rating}`)}
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
  diaryFilters: diaryFiltersSelector(state),
})

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({
  fireEvent,
  filterDiary,
}, dispatch) })

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(DiaryFilter)
