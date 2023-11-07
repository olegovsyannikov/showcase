import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'components'
import { NavLink } from 'react-router-dom'
import { withTranslation } from 'react-i18next'

import './Menu.styl'

const Menu = ({ t, items, location }) => {
  return (
    <div className={`menu menu--${location}`}>
      {items.map(item => (
        item.visible && (
          <NavLink
            key={item.id}
            className="menu__link"
            activeClassName="menu__link--active"
            exact={item.id === 1}
            to={item.link}
            onClick={e => {
              if (item.link === '#') {
                e.preventDefault()
                item.action()
              }
              if (item.link.startsWith('http')) {
                const newWindow = window.open(item.link, '_blank', 'noopener,noreferrer')
                if (newWindow) newWindow.opener = null
                e.preventDefault()
              }
            }}
          >
            <span
              className="menu__link-icon"
              data-unread={item.unreadCount}
            >
              <Icon
                name={item.icon}
                className="menu__icon"
              />
            </span>
            <span className="menu__link-text">{t(item.title)}</span>
            {item.description && (
              <span className="menu__link-description">{t(item.description)}</span>
            )}
          </NavLink>
        )))}
    </div>
  )
}

Menu.propTypes = {
  t: PropTypes.func.isRequired,
  items: PropTypes.array,
  location: PropTypes.string.isRequired,
}

Menu.defaultProps = {
  items: [],
}

export default withTranslation()(Menu)
