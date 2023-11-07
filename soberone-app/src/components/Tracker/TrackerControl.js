import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import Moment from 'moment'
import { compose } from 'recompose'
import { withTranslation } from 'react-i18next'

import { Button } from 'components'

const TrackerControl = ({ date, t }) => {
  const today = Moment(new Date())

  let title
  if (date <= today) {
    const dateString = () => {
      switch (today.diff(date, 'days')) {
        case 0:
          return t('tracker.today')
        case 1:
          return t('tracker.yesterday')
        case 2:
          return t('tracker.2daysago')
        default:
          return `${t('tracker.preposition')} ${date.format('Do')}`
      }
    }

    title = t('tracker.question', { date: dateString() })
  } else title = t('tracker.disabled')

  return (
    <div className="block tracker-control">
      <>
        <div className="tracker-control__title">{title}</div>
        <div className="tracker-control__buttons">
          <Button
            component={NavLink}
            kind="primary"
            size="l"
            className="tracker-control__button tracker-control__button--yes"
            to={`/tools/diary/add/1/${date.format('YYYY-MM-DD')}`}
            disabled={date > today}
          >
            {t('tracker.buttons.yes')} <span
              role="img"
              aria-label={t('tracker.buttons.yes')}
            >🍻</span>
          </Button>
          <Button
            component={NavLink}
            kind="primary"
            size="l"
            className="tracker-control__button tracker-control__button--no"
            to={`/tools/diary/add/0/${date.format('YYYY-MM-DD')}`}
            disabled={date > today}
          >
            {t('tracker.buttons.no')} <span
              role="img"
              aria-label={t('tracker.buttons.no')}
            >👍</span>
          </Button>
        </div>
      </>
    </div>
  )
}

TrackerControl.propTypes = {
  date: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
}

export default compose(
  withTranslation(),
)(TrackerControl)
