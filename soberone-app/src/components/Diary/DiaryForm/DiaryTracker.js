import React from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { Radio } from 'components'

const DiaryTracker = ({ t, onChange, value }) => (
  <div className="block block--radio">
    <div className="block__title">
      {t('diary.item.trackerTitle')}
    </div>
    <div
      className="block__content"
      onClick={onChange}
    >
      <Radio
        defaultChecked={value === 1}
        id="tracker_0"
        name="tracker"
        value={1}
      >
        {t('diary.item.tracker.yes')} <span
          role="img"
          aria-label={t('diary.item.tracker.yes')}
        >🍷</span>
      </Radio>
      <Radio
        defaultChecked={value === 0}
        id="tracker_1"
        name="tracker"
        value={0}
      >
        {t('diary.item.tracker.no')} <span
          role="img"
          aria-label={t('diary.item.tracker.no')}
        >👌</span>
      </Radio>
    </div>
  </div>
)

DiaryTracker.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOf([0, 1]).isRequired,
}

export default withTranslation()(DiaryTracker)
