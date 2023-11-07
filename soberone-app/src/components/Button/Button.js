import { noop } from 'lodash'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { bindActionCreators } from 'redux'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import fireEvent from 'actions/EventsActions'

import { withFocusedState } from 'hocs'

import './Button.styl'

class Button extends React.PureComponent {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    code: PropTypes.string,
    kind: PropTypes.oneOf(['primary', 'secondary', 'finished', 'light', 'outline', 'ghost', 'inverse', 'social', 'transparent', 'select']),
    size: PropTypes.oneOf(['s', 'm', 'l']),
    format: PropTypes.oneOf(['icon', 'rounded', 'straight', 'noborder', 'file', 'wrapper']),
    align: PropTypes.string,
    icon: PropTypes.string,
    type: PropTypes.string,
    to: PropTypes.string,
    disabled: PropTypes.bool,
    classNamePrefix: PropTypes.string,
    className: PropTypes.string,
    focused: PropTypes.bool,
    selected: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func,
    onClick: PropTypes.func,
    actions: PropTypes.shape({
      fireEvent: PropTypes.func.isRequired,
    }),
  };

  static defaultProps = {
    component: 'button',
    code: null,
    kind: 'primary',
    size: 'm',
    format: null,
    align: null,
    icon: null,
    type: 'button',
    to: null,
    disabled: false,
    selected: false,
    classNamePrefix: 'so-button',
    className: '',
    focused: false,
    onFocus: noop,
    onBlur: noop,
    onMouseEnter: noop,
    onMouseLeave: noop,
    onMouseDown: noop,
    onMouseUp: noop,
    onClick: noop,
    actions: {
      fireEvent: () => {},
    },
  };

  state = {
    hovered: false,
    pressed: false,
  };

  static getDerivedStateFromProps(props) {
    const { disabled } = props

    if (disabled) {
      return { hovered: false, pressed: false }
    }

    return null
  }

  handleMouseEnter = e => {
    const { disabled, onMouseEnter } = this.props

    if (disabled) {
      return false
    }

    this.setState({ hovered: true })

    return onMouseEnter(e)
  };

  handleMouseLeave = e => {
    const { disabled, onMouseLeave } = this.props

    if (disabled) {
      return false
    }

    this.setState({ hovered: false, pressed: false })

    return onMouseLeave(e)
  };

  handleMouseDown = e => {
    const { disabled, focused, onMouseDown } = this.props

    if (disabled) {
      return false
    }

    this.setState({ pressed: true })

    if (!focused) {
      setTimeout(() => typeof e.focus === 'function' && e.focus(), 0)
    }

    return onMouseDown(e)
  };

  handleMouseUp = e => {
    const { disabled, onMouseUp } = this.props

    if (disabled) {
      return false
    }

    this.setState({ pressed: false })

    return onMouseUp(e)
  };

  handleClick = e => {
    const { code, disabled, onClick, to, actions } = this.props
    const { router: { history } } = this.context

    actions.fireEvent('button_pressed', {
      to,
      code,
    })

    if (disabled) {
      e.preventDefault()
      return false
    }

    this.setState({ hovered: false, pressed: false })
    e.currentTarget.blur()

    if (to) {
      e.preventDefault()

      // External link
      if (to.includes('http')) {
        window.open(to, '_blank')
        return true
      }

      // Internal transition
      return history.push(to)
    }

    // Custom handler
    if (onClick !== noop) {
      e.preventDefault()
      return onClick(e)
    }

    return true
  };

  ref = ref => this.element = ref;

  render() {
    const { hovered, pressed } = this.state
    const {
      component: Component,
      kind,
      size,
      icon,
      code,
      format,
      align,
      disabled,
      classNamePrefix,
      className,
      focused,
      selected,
      onFocus,
      onBlur,
      ...other
    } = this.props

    const mergedClassName = cx(
      classNamePrefix,
      {
        [`${classNamePrefix}--${size}`]: size,
        [`${classNamePrefix}--${format}`]: format,
        [`${classNamePrefix}--${kind}`]: kind,
        [`${classNamePrefix}--${align}`]: align,
        [`${classNamePrefix}--${icon}`]: icon,
        [`${classNamePrefix}--disabled`]: disabled === true,
        [`${classNamePrefix}--active`]: focused || selected,
        [`${classNamePrefix}--hover`]: hovered && !focused,
        [`${classNamePrefix}--hover-active`]: hovered && focused,
        [`${classNamePrefix}--press`]: pressed,
      },
      className,
    )

    return (
      <Component
        {...{
          ...other,
          disabled,
          className: mergedClassName,
          onClick: this.handleClick,
          onFocus,
          onBlur,
          onMouseEnter: this.handleMouseEnter,
          onMouseLeave: this.handleMouseLeave,
          onMouseDown: this.handleMouseDown,
          onMouseUp: this.handleMouseUp,
        }}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    fireEvent,
  }, dispatch),
})

export default compose(
  withFocusedState,
  connect(null, mapDispatchToProps),
)(Button)
