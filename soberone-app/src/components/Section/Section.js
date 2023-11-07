import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import './Section.styl'

class Section extends PureComponent {
  static propTypes = {
    isFooterVisible: PropTypes.bool,
    page: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    background: PropTypes.bool,
    children: PropTypes.node.isRequired,
    contentRef: PropTypes.object,
  };

  static defaultProps = {
    isFooterVisible: true,
    page: null,
    type: null,
    background: false,
    className: null,
    contentRef: null,
  };

  render() {
    const {
      page,
      type,
      background,
      className,
      children,
      contentRef,
      isFooterVisible,
      ...other
    } = this.props

    return (
      <section
        className={
          cx(
            'section',
            {
              [`section--${page}`]: page,
              [`section--${type}`]: type,
              'section--no-footer': !isFooterVisible,
            },
            className,
          )
        }
        {...other}
      >
        {background && <div className="section__bg" />}
        <div
          className="section__content"
          ref={contentRef}
        >
          {children}
        </div>
      </section>
    )
  }
}

export default React.forwardRef((props, ref) => (
  <Section
    contentRef={ref}
    {...props}
  />
))
