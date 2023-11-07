import { map, pickBy, keys } from 'lodash'

import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'components'
import { useTranslation } from 'react-i18next'

const MyAnswers = ({ items, result }) => {
  const { t } = useTranslation()
  const getAnswers = (item, answer) => {
    if (typeof answer === 'object') {
      const indexes = keys(pickBy(answer))
      const answers = map(indexes, key => item.options[key].label)
      // Отображаем ответы списком через точку с запятой - тип: checkboxes
      return answers.join('; ')
    }

    if (typeof answer === 'boolean') {
      // Отображаем label поля при ответе TRUE/FALSE - тип: checkbox
      return item.label
    }

    // В остальных случаях отображаем ответ
    return answer
  }

  const answers = map(items, item => ({
    id: item.id,
    title: item.title,
    answer: getAnswers(item.text, result[item.id]) || undefined,
  }))

  return (
    <>
      <h2 className="heading--h2 mb--lg-m">{t('tasks.item.myAnswers.title')}</h2>
      <ol className="list list--answers">
        {answers.map(question => (
          <li
            className="list__item"
            key={question.id}
          >
            <p className="text--caption color--grey54 mb--lg-xxs">{question.title}</p>
            {question.answer ? (
              <p className="text--primary">{question.answer}</p>
            ) : (
              <Badge
                label={t('tasks.item.myAnswers.empty')}
                className="badge--no-answer"
              />
            )}
          </li>
        ))}
      </ol>
    </>
  )
}

MyAnswers.propTypes = {
  items: PropTypes.array,
  result: PropTypes.object,
}

MyAnswers.defaultProps = {
  items: [],
  result: {},
}

export default MyAnswers
