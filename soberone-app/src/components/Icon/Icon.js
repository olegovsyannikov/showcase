import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import './icons.font'

class Icon extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    className: PropTypes.string,
    classNamePrefix: PropTypes.string,
  };

  static defaultProps = {
    size: 24,
    className: '',
    classNamePrefix: 'so-icon',
  };

  render() {
    const { name, size, className, classNamePrefix, ...otherProps } = this.props

    return (
      <i
        className={cx(classNamePrefix, `${classNamePrefix}--${name}`, className)}
        style={{ fontSize: `${size}px` }}
        {...otherProps}
      />
    )
  }
}

export default Icon
