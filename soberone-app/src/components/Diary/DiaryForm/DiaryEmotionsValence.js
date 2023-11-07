import React from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { Range } from 'components'

import { DIARY_EMOTIONS_VALENCE } from 'constants/ux'

const DiaryEmotionsValence = ({ t, onChange, value }) => (
  <div className="block block--range">
    <div className="block__content">
      <Range
        rangeInfo={{
          id: 'emotions_valence',
          icon: true,
          title: t('diary.item.emotionsValenceTitle'),
          value,
          settings: {
            values: DIARY_EMOTIONS_VALENCE.values,
            labels: t('diary.emotions.valence.labels', { returnObjects: true }),
          },
        }}
        updateHandler={onChange}
      />
    </div>
  </div>
)

DiaryEmotionsValence.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
}

export default withTranslation()(DiaryEmotionsValence)
