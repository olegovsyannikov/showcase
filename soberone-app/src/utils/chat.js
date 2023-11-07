import moment from 'moment-timezone'

export const injectDates = (messages = []) => {
  const result = []

  messages.forEach(message => {
    const currentDate = message.timestamp
    const prevDate = result.length ? result[result.length - 1].timestamp : undefined

    if (result.length > 0 && prevDate && !moment(currentDate).isSame(moment(prevDate), 'day')) {
      result.push({ type: 'date', timestamp: message.timestamp })
    }

    result.push(message)
  })
  return result
}

export default { injectDates }
