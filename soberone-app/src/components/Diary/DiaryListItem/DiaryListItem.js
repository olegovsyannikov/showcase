import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import Moment from 'moment'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { fromUnicode } from 'utils/unicode'

import {
  Icon,
} from 'components'

import {
  DIARY_CRAVING,
  DIARY_USE_QUANTITY,
  DIARY_EMOTIONS_VALENCE,
} from 'constants/ux'

import './DiaryListItem.styl'

const DiaryListItem = ({ item, type }) => {
  const { t } = useTranslation()

  const mergedClassName = cx(
    'diary-list-item',
    {
      [`diary-list-item--${type}`]: type,
    },
  )

  const valenceLabels = t('diary.emotions.valence.labels', { returnObjects: true })
  const cravingLabels = t('diary.emotions.craving.labels', { returnObjects: true })
  const useQuantityLabels = t('diary.useQuantity.labels', { returnObjects: true })

  const useQuantity = {
    color: item.use_quantity !== null ? DIARY_USE_QUANTITY.values.max - item.use_quantity : 'none',
    value: useQuantityLabels[item.use_quantity] ?? '—',
  }
  const craving = {
    color: item.craving !== null ? DIARY_CRAVING.values.max - item.craving : 'none',
    value: cravingLabels[item.craving] ?? '—',
  }

  const valence = item.emotions_valence !== null ?
    item.emotions_valence :
    item.rating - DIARY_EMOTIONS_VALENCE.values.max

  const emotionsValence = {
    color: DIARY_EMOTIONS_VALENCE.values.max + valence,
    value: valenceLabels[valence],
  }

  const dateLabel = timestamp => {
    const time = Moment.unix(timestamp).utc().format('YYYY-MM-DD')
    const date = Moment(time)
    const today = Moment(new Date())

    const daysDiff = today.diff(date, 'days')

    let result
    if (daysDiff === 0) {
      result = t('diary.today')
    } else if (daysDiff < 7) {
      result = date.add(1, 'days').fromNow()
    } else {
      result = date.format('MMMM, Do')
    }

    return result
  }

  const isShowComment = item.comment &&
    (
      (item.tags.length === 0 && type === 'tracker') ||
      type === 'diary'
    )

  return (
    <div className={mergedClassName}>
      <div className="diary-stats">
        <div className="diary-stats__item diary-stats__item--1">
          <div className="diary-stats__item-content">
            <div className="diary-stats__item-label">{t('diary.listItem.useQuantity')}</div>
            <div className={`diary-stats__item-value color-scale--${useQuantity.color}`}>
              {useQuantity.value}
            </div>
          </div>
        </div>
        <div className="diary-stats__item diary-stats__item--2">
          <div className="diary-stats__item-content">
            <div className="diary-stats__item-label">{t('diary.listItem.feelings')}</div>
            <div className={`diary-stats__item-value color-scale--${emotionsValence.color}`}>
              {emotionsValence.value}
            </div>
          </div>
        </div>
        <div className="diary-stats__item diary-stats__item--3">
          <div className="diary-stats__item-content">
            <div className="diary-stats__item-label">{t('diary.listItem.craving')}</div>
            <div className={`diary-stats__item-value color-scale--${craving.color}`}>
              {craving.value}
            </div>
          </div>
        </div>
      </div>
      {item.tags.length > 0 || type === 'tracker' ? (
        <div className="diary-list-item__badges">
          {item.tags.map(tag => (<span
            className="badge badge--sm badge--label"
            key={tag.id}
          >{tag.title}</span>))}
          {type === 'tracker' && item.tags.length === 0 && !item.comment && (
            <span
              className="badge badge--sm badge--label badge--outline"
              key="empty"
            >{t('diary.item.noTriggers')}</span>
          )}
        </div>
      ) : null}
      {isShowComment && (
        <div className="diary-list-item__info">
          {fromUnicode(item.comment)}
        </div>
      )}
      {type === 'diary' && (
        <div className="diary-list-item__date">
          {dateLabel(item.timestamp)}
          {item.is_editable && (
            <NavLink
              className="diary-list-item__date-button"
              to={`/tools/diary/edit/${item.id}`}
            >
              <Icon
                name="pencil"
                size={16}
              />
            </NavLink>
          )}
        </div>
      )}
    </div>
  )
}

DiaryListItem.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['diary', 'tracker']),
}

DiaryListItem.defaultProps = {
  type: 'diary',
}

export default DiaryListItem
