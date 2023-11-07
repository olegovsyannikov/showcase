import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import './Tabs.styl'

class Tabs extends Component {
  static propTypes = {
    setActiveTab: PropTypes.func.isRequired,
    selected: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      selected: props.selected,
    }
  }

  onClick(index, event) {
    const { setActiveTab } = this.props
    const { selected } = this.state

    event.preventDefault()
    this.setState({ previousSelected: selected })
    this.setState({ selected: index })

    setActiveTab(index)
  }

  renderTitles() {
    function labels(child, idx) {
      const { selected } = this.state

      const activeClass = (
        selected === idx
          ? 'tabs__header-item tabs__header-item--active'
          : 'tabs__header-item'
      )

      return (
        <li
          className={activeClass}
          role="tab"
          key={idx}
          aria-controls={`panel${idx}`}
          onClick={this.onClick.bind(this, idx)}
        >
          {child.props.label}
          {
            child.props.count ?
              (<small>{child.props.count}</small>) :
              ''
          }
        </li>
      )
    }

    const { children } = this.props

    return (
      <ul
        className="tabs__header"
        role="tablist"
      >
        {children.map(labels.bind(this))}
      </ul>
    )
  }

  render() {
    const { children } = this.props
    const {
      previousSelected,
      selected,
    } = this.state

    const animationClassNames = selected > previousSelected ? 'slide--forward' : 'slide--backward'

    return (
      <div className="tabs">
        {this.renderTitles()}

        <TransitionGroup
          childFactory={child => React.cloneElement(child, {
            classNames: animationClassNames,
          })}
        >
          <CSSTransition
            in
            appear
            timeout={200}
            classNames={animationClassNames}
            key={`tab_${selected}`}
          >
            <div className="tabs__content">
              {children[selected]}
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    )
  }
}

export default Tabs
