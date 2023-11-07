import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TabsItem extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    fireEvent: PropTypes.func.isRequired,
    position: PropTypes.number,
    children: PropTypes.node.isRequired,
  }

  static defaultProps= {
    position: 0,
  }

  componentDidMount() {
    const {
      fireEvent,
      position,
      type,
    } = this.props

    if (type === 'tasks') {
      fireEvent('screen_view', {
        screen: 'tasks_list',
      })
    }
    if (type === 'auth') {
      fireEvent('screen_view', {
        screen: 'auth',
      })
      fireEvent('screen_auth', { tab: (position ? 'sign up' : 'log in') })
    }
  }

  render() {
    const { children } = this.props
    return (
      <div className="tabs__content-item">
        {children}
      </div>
    )
  }
}

export default TabsItem
