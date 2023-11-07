import React from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { Range } from 'components'

import { DIARY_EMOTIONS_INTENSITY } from 'constants/ux'

const DiaryEmotionsIntensity = ({ t, onChange, value }) => (
  <div className="block block--range">
    <div className="block__content">
      <Range
        rangeInfo={{
          id: 'emotions_intensity',
          color: 'none',
          icon: false,
          title: t('diary.item.emotionsIntensityTitle'),
          value,
          settings: {
            values: DIARY_EMOTIONS_INTENSITY.values,
            labels: t('diary.emotions.intensity.labels', { returnObjects: true }),
          },
        }}
        updateHandler={onChange}
      />
    </div>
  </div>
)

DiaryEmotionsIntensity.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
}

export default withTranslation()(DiaryEmotionsIntensity)
