import PropTypes from 'prop-types'
import Moment from 'moment'
import i18n from 'i18n'

const DiaryStats = ({ data }) => {
  const stats = {
    usage7Days: 0,
    usage7DaysBefore: 0,
    quantity7Days: 0,
    quantity7DaysBefore: 0,
    usage30Days: 0,
    quantity30Days: 0,
    usage30DaysPositive: 0,
    usage30DaysNegative: 0,
    usage30DaysNeutral: 0,
    usage30DaysBefore: 0,
    quantity30DaysBefore: 0,
    usage30DaysBeforePositive: 0,
    usage30DaysBeforeNegative: 0,
    usage30DaysBeforeNeutral: 0,
    triggers: {},
    triggersLapse: {},
    triggersNoLapse: {},
    dailyTips: [],
  }
  // TODO: Добавить сравнение с другими пользователями

  if (data !== undefined) {
    // 7 Days Stats

    let date = Moment(new Date())

    for (let i = 1; i <= 7; i += 1) {
      const dateStats = data[date.format('YYYY-MM-DD')]
      const date7DaysBeforeStats = data[Moment(date).subtract(7, 'days').format('YYYY-MM-DD')]

      if (dateStats) {
        if (dateStats[0].tracker) {
          stats.usage7Days += 1
        }
        stats.quantity7Days += dateStats[0].use_quantity
      }

      if (date7DaysBeforeStats) {
        if (date7DaysBeforeStats[0].tracker) {
          stats.usage7DaysBefore += 1
        }
        stats.quantity7DaysBefore += date7DaysBeforeStats[0].use_quantity
      }
      date.subtract(1, 'days')
    }

    // 30 Days Stats

    date = Moment()

    for (let i = 1; i <= 30; i += 1) {
      const dateStats = data[date.format('YYYY-MM-DD')]
      const date30DaysBeforeStats = data[Moment(date).subtract(30, 'days').format('YYYY-MM-DD')]

      // 30 Days Usage & Quantity

      if (dateStats) {
        if (dateStats[0].tracker) {
          stats.usage30Days += 1
        }
        stats.quantity30Days += dateStats[0].use_quantity

        // Usage Emotions Valence
        if (dateStats[0].emotions_valence > 0) {
          stats.usage30DaysPositive += 1
        } else if (dateStats[0].emotions_valence < 0) {
          stats.usage30DaysNegative += 1
        } else {
          stats.usage30DaysNeutral += 1
        }
      }

      // 30 Days Before Usage & Quantity

      if (date30DaysBeforeStats) {
        if (date30DaysBeforeStats[0].tracker) {
          stats.usage30DaysBefore += 1
        }
        stats.quantity30DaysBefore += date30DaysBeforeStats[0].use_quantity

        // Usage Emotions Valence
        if (date30DaysBeforeStats[0].emotions_valence > 0) {
          stats.usage30DaysBeforePositive += 1
        } else if (date30DaysBeforeStats[0].emotions_valence < 0) {
          stats.usage30DaysBeforeNegative += 1
        } else {
          stats.usage30DaysBeforeNeutral += 1
        }
      }

      // Triggers

      if (dateStats && dateStats[0].tags) {
        dateStats[0].tags.forEach(tag => {
          // General Trigger Stats
          if (stats.triggers[tag.title] === undefined) {
            stats.triggers[tag.title] = 1
          } else {
            stats.triggers[tag.title] += 1
          }

          // If booze has been tracked this day
          if (dateStats[0].tracker !== undefined) {
            // Trigger caused lapse
            if (dateStats[0].tracker) {
              if (stats.triggersLapse[tag.title] === undefined) {
                stats.triggersLapse[tag.title] = 1
              } else {
                stats.triggersLapse[tag.title] += 1
              }

            // Trigger not caused lapse
            } else {
              // eslint-disable-next-line
              if (stats.triggersNoLapse[tag.title] === undefined) {
                stats.triggersNoLapse[tag.title] = 1
              } else {
                stats.triggersNoLapse[tag.title] += 1
              }
            }
          }
        })
      }
      date.subtract(1, 'days')
    }

    const usageDelta = stats.usage7Days - stats.usage7DaysBefore
    if (stats.usage7Days === 0 && stats.usage7DaysBefore === 0) {
      stats.dailyTips.push(i18n.t('diary.stats.tips.usageEmpty'))
    } else if (usageDelta > 0) {
      stats.dailyTips.push(i18n.t('diary.stats.tips.usageMore', { delta: usageDelta }))
    } else if (usageDelta < 0) {
      stats.dailyTips.push(i18n.t('diary.stats.tips.usageLess', { delta: -usageDelta }))
    } else {
      stats.dailyTips.push(i18n.t('diary.stats.tips.usageSame'))
    }
  }

  return stats
}

DiaryStats.propTypes = {
  data: PropTypes.object.isRequired,
}

DiaryStats.defaultProps = {
}

export default DiaryStats
