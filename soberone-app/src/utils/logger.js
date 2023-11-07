export const logToDOM = message => {
  window.__DEBUG__ && setTimeout(() => { // eslint-disable-line
    let el = document.getElementById('logger-element')

    if (!el) {
      el = document.createElement('div')
      el.id = 'logger-element'
      el.style.position = 'fixed'
      el.style.top = 0
      el.style.left = 0
      el.style.right = 0
      el.style.background = 'white'
      el.style['z-index'] = '1000000'
      document.body.appendChild(el)
    }

    el.innerHTML = message
  }, 100)
}

export default { logToDOM }
