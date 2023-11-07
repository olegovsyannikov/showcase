import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Icon } from 'components'
import './ProgressBar.styl'

export default class ProgressBar extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    value: PropTypes.number.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    type: null,
    className: null,
  };

  fill = value => 2 * Math.PI * 30 * (1 - (value / 100))

  render() {
    const {
      type,
      value,
      className,
    } = this.props

    return (
      <div
        className={
          cx(
            'progress', {
              [`progress--${type}`]: type,
            },
            className,
          )
        }
      >
        <svg
          className="progress__svg"
          width="64"
          height="64"
          viewBox="0 0 64 64"
        >
          <circle
            className="progress__meter"
            cx="32"
            cy="32"
            r="30"
            strokeWidth="4"
          />
          <circle
            className="progress__value"
            cx="32"
            cy="32"
            r="30"
            strokeWidth="4"
            strokeDashoffset={this.fill(value)}
            strokeDasharray={2 * Math.PI * 30}
          />
        </svg>
        <Icon
          name={type}
          className="progress__icon"
        />
      </div>
    )
  }
}
