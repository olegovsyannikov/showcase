import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './AccordionItem.styl'

export default class AccordionItem extends Component {
  static propTypes = {
    isActive: PropTypes.bool,
    title: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired,
  };

  static defaultProps = {
    isActive: false,
  };

  constructor(props) {
    super(props)
    const { isActive } = props
    this.state = {
      isActive,
    }
  }

  toggleItem = () => {
    const { isActive } = this.state
    this.setState({
      isActive: !isActive,
    })
  }

  render() {
    const { title, children } = this.props
    const { isActive } = this.state

    return (
      <div className={`accordion__item${isActive ? ' accordion__item--active' : ''}`}>
        <div
          className="accordion__item-header"
          onClick={this.toggleItem}
        >{title}</div>
        <div className="accordion__item-content">{children}</div>
      </div>
    )
  }
}
