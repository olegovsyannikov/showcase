import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'recompose'
import { withTranslation } from 'react-i18next'

import InstaStories from 'react-insta-stories'

import './index.styl'

class Stories extends React.Component {
  static propTypes = {
    stories: PropTypes.array.isRequired,
    onAllStoriesEnd: PropTypes.func,
    t: PropTypes.func.isRequired,
  }

  static defaultProps = {
    onAllStoriesEnd: {}
  };

  render() {
    const {
      stories,
      onAllStoriesEnd
    } = this.props

    return (
      <div className='story'>
        <div className='story__content'>
          <InstaStories
            stories={stories}
            onAllStoriesEnd={onAllStoriesEnd}
            defaultInterval={3000}
            width='100%'
            height='100%'
          />
        </div>
      </div>
    )
  }
}

export default compose(
  withTranslation(),
)(Stories)
