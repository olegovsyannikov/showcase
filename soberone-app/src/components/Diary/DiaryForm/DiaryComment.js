import React from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { TextArea } from 'components'

const DiaryComment = ({ t, onChange, value }) => (
  <div className="block block--text">
    <div className="block__content">
      <TextArea
        kind="default"
        name="comment"
        autosize
        onChange={e => {
          if (e.type === 'change') {
            onChange(e)
          }
        }}
        defaultValue={value}
        label={t('diary.item.detailsTitle')}
      />
    </div>
  </div>
)

DiaryComment.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}

export default withTranslation()(DiaryComment)
