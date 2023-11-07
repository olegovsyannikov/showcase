import React from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { Range } from 'components'

import { DIARY_CRAVING } from 'constants/ux'

const DiaryCraving = ({ t, onChange, value }) => (
  <div className="block block--range">
    <div className="block__content">
      <Range
        rangeInfo={{
          id: 'craving',
          icon: true,
          order: 'inverse',
          title: t('diary.item.cravingTitle'),
          value,
          settings: {
            values: DIARY_CRAVING.values,
            labels: t('diary.emotions.craving.labels', { returnObjects: true }),
          },
        }}
        updateHandler={onChange}
      />
    </div>
  </div>
)

DiaryCraving.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
}

export default withTranslation()(DiaryCraving)
