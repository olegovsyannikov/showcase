export const toUnicode = str => str.split('').map(value => {
  const temp = value.charCodeAt(0).toString(16).toUpperCase()
  if (temp.length > 2) {
    return `\\u${temp}`
  }
  return value
}).join('')

export const fromUnicode = str => str.replace(/\\u(\w\w\w\w?)/g, (a, b) => {
  const charcode = parseInt(b, 16)
  return String.fromCharCode(charcode)
})

export default { fromUnicode, toUnicode }
