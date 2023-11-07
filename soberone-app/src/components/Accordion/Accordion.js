import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Accordion extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    const { children } = this.props
    return (
      <div {...this.props}>
        {children}
      </div>
    )
  }
}
