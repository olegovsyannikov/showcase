import React from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { Range } from 'components'

import { DIARY_USE_QUANTITY } from 'constants/ux'

const DiaryQuantity = ({ t, onChange, value }) => (
  <div className="block block--range">
    <div className="block__content">
      <Range
        rangeInfo={{
          id: 'use_quantity',
          icon: true,
          order: 'inverse',
          title: t('diary.item.useQuantityTitle'),
          value,
          settings: {
            values: DIARY_USE_QUANTITY.values,
            labels: t('diary.useQuantity.labels', { returnObjects: true }),
          },
        }}
        updateHandler={onChange}
      />
    </div>
  </div>
)

DiaryQuantity.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
}

export default withTranslation()(DiaryQuantity)
