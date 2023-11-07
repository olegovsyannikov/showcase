import { useState, useEffect } from 'react'
import Centrifuge from 'centrifuge'
import { API_CENTRIFUGE_URL } from '../constants/config'

const useCentrifuge = () => {
  const [centrifuge, setCentrifuge] = useState(null)

  useEffect(() => {
    if (!centrifuge) {
      const c = new Centrifuge(
        API_CENTRIFUGE_URL,
        { debug: process.env.NODE_ENV === 'development' },
      )
      c.connect()
      c.on('disconnect', () => {
        setCentrifuge(null)
      })
      setCentrifuge(c)
    }
  }, []) // eslint-disable-line

  return centrifuge
}

export default useCentrifuge
