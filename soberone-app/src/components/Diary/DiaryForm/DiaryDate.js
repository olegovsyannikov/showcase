import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { withTranslation } from 'react-i18next'

const DiaryDate = ({ t, onChange, value }) => (
  <div className="form__group">
    <div className="form__label">
      <input
        type="date"
        name="timestamp"
        className="form__input form__input--date"
        value={moment(value).format('YYYY-MM-DD')}
        max={moment().format('YYYY-MM-DD')}
        onChange={onChange}
      />
      <span className="form__label-text form__label-text--hint">
        {t('diary.item.date')}
      </span>
    </div>
  </div>
)

DiaryDate.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(moment.Moment),
  ]).isRequired,
}

export default withTranslation()(DiaryDate)
