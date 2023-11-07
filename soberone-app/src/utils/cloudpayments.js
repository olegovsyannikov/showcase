const loadScript = resolve => {
  const s = document.createElement('script')
  s.type = 'text/javascript'
  s.async = true
  s.src = 'https://widget.cloudpayments.ru/bundles/cloudpayments'
  s.onload = resolve
  const x = document.getElementsByTagName('script')[0]
  x.parentNode.insertBefore(s, x)
}

export const attachCloudPaymentsScript = () => {
  const promise = new Promise(resolve => {
    const onLoad = () => loadScript(resolve)

    if (document.readyState === 'loading') {
      if (window.attachEvent) {
        window.attachEvent('onload', onLoad)
      } else {
        window.addEventListener('load', onLoad, false)
      }
    } else {
      onLoad()
    }
  })

  return promise
}

export default attachCloudPaymentsScript
