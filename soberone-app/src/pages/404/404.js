import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { compose } from 'recompose'
import { withTranslation } from 'react-i18next'

import './404.styl'

class NotFoundPage extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  render() {
    const { t } = this.props
    return (
      <div className="page">
        <h1>{t('404.title')}</h1>
        <p>{t('404.text')}</p>
      </div>
    )
  }
}

export default compose(
  withTranslation(),
)(NotFoundPage)
