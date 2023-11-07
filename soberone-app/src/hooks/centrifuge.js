import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Centrifuge from 'centrifuge'

import { centrifugeUrl } from '../config/app'

export function useCentrifuge() {
  const [client, setClient] = useState()
  const [isConnected, setIsConnected] = useState(false)
  const settings = useSelector(state => state.UserInfo.settings)

  useEffect(() => {
    setClient(new Centrifuge(
      centrifugeUrl,
      { debug: process.env.NODE_ENV === 'development' },
    ))
  }, [])

  useEffect(() => {
    if (client && !isConnected) {
      if (settings) {
        client.setToken(settings.centrifuge_token)
        client.connect()
        setIsConnected(true)
      } else {
        client.disconnect()
        setIsConnected(false)
      }
    }
  }, [settings]) // eslint-disable-line

  return client
}
