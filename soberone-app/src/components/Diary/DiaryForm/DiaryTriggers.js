import React from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { Checkbox } from 'components'

const DiaryTriggers = ({ t, onChange, tags }) => {
  const triggers = t('diary.triggers', { returnObjects: true })
  return (
    <div className="block block--tags">
      <div className="block__title">
        {t('diary.item.triggersTitle')}
      </div>
      <div className="block__content">
        {Array.isArray(triggers) ? triggers.sort().map((item, index) => (
          <Checkbox
            key={index}
            defaultChecked={tags.findIndex(i => i === item) !== -1}
            id={`check_${index}`}
            name="tags"
            kind="rounded"
            onChange={onChange}
            value={item}
          >
            {item}
          </Checkbox>
        )) : null}
      </div>
    </div>
  )
}

DiaryTriggers.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
}

export default withTranslation()(DiaryTriggers)
