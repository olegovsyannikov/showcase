import React, { Component } from 'react'
import { compose } from 'recompose'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'

import { Badge, Icon } from 'components'
import './Card.styl'
import { STAGES } from 'constants/stages'

import i18n from '../../i18n'

class Card extends Component {
  static propTypes = {
    kind: PropTypes.string,
    type: PropTypes.string,
    stage: PropTypes.object,
    category: PropTypes.number,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    announce: PropTypes.string,
    meta: PropTypes.object,
    image: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    author: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
    isDisabled: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
    t: PropTypes.func.isRequired,
  }

  static defaultProps = {
    kind: '',
    type: '',
    title: '',
    image: '',
    stage: null,
    subtitle: '',
    category: null,
    announce: '',
    author: {},
    className: '',
    meta: {},
    isDisabled: false,
    onClick: () => {},
  }

  state = {
    isActive: false,
  };

  toggleItem = () => {
    const { isActive } = this.state
    this.setState({
      isActive: !isActive,
    })
  }

  render() {
    const {
      kind,
      type,
      meta,
      category,
      stage,
      title,
      image,
      subtitle,
      announce,
      author: {
        name: authorName,
        avatar: authorAvatar,
      },
      className,
      onClick,
      isDisabled,
      t,
    } = this.props

    const { isActive } = this.state

    const mergedClassName = cx(
      'card',
      {
        [`card--${kind}`]: !!kind,
        [`card--${category}`]: !!category,
        [`card--${type}`]: !!type,
        'card--active': isActive,
        'card--disabled': isDisabled,
      },
      className,
    )

    const badge = (isPremium, status) => {
      const statuses = {
        new: t('tasks.statuses.new'),
        seen: '',
        premium: t('tasks.statuses.premium'),
        in_progress: t('tasks.statuses.inProgress'),
        finished: t('tasks.statuses.completed'),
      }

      if (isPremium && status !== 'in_progress') {
        return (
          <Badge
            label={statuses[status !== 'seen' ? status : 'premium']}
            type="label"
            icon="star"
            iconSize={16}
            className={`badge--${status} badge--premium`}
          />
        )
      }

      // Content Not Premium or Status == In Progress
      if (status !== 'seen') {
        return (
          <Badge
            label={statuses[status]}
            type="label"
            className={`badge--${status}`}
          />
        )
      }

      return null
    }

    // TODO: убрать жесткий хардкод
    const isPremium = i18n.language !== 'ru' && stage && (stage.funnel_id === 2 || stage.funnel_id === 6 || stage.funnel_id === 5)

    return (
      <div
        className={mergedClassName}
        onClick={type === 'answer' ? this.toggleItem : onClick}
        data-stage={STAGES[stage]}
      >
        {!!image && (
          <div className="card__header">
            {image && image.icon ? (
              <Icon
                name={image.icon}
                className="card__icon"
              />
            ) : (
              <>
                <figure className="card__figure">
                  <img
                    className="card__figure-img"
                    src={image}
                    alt={title}
                  />
                </figure>
                <div className="card__figure-overlay"></div>
              </>
            )}
          </div>
        )}
        <div className="card__body">
          {!!subtitle && (
            <div className="card__subtitle">{subtitle}</div>
          )}
          {!!title && (
            <div className="card__title">{title}</div>
          )}
          {!!announce && (
            <div className="card__announce">{announce}</div>
          )}
          {!!authorName && (
            <div className="card__author">
              <div className="card__author-avatar">
                {authorAvatar ? (
                  <img
                    src={authorAvatar}
                    className="card__author-img"
                    alt={authorName}
                  />
                ) : (
                  <Icon
                    name="profile"
                    size={20}
                    className="card__author-img"
                  />
                )}
              </div>
              <p className="card__author-name">{authorName}</p>
            </div>
          )}
          {Object.keys(meta).length > 0 && (
            <div className="card__meta">
              {badge(isPremium, meta.status)}
              {meta.time && (
                <Badge
                  label={meta.time}
                  type="time"
                  icon="timer"
                />
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default compose(
  withTranslation(),
)(Card)
