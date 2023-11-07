import { API_CHAT_URL, API_CHAT_SOCKET } from '../constants/config'

const io = require('socket.io-client')

export default () => {
  const socket = io.connect(
    API_CHAT_URL,
    {
      secure: process.env.NODE_ENV === 'production',
      path: API_CHAT_SOCKET,
      pingInterval: 1000,
      pingTimeout: 5000,
      transports: ['websocket'],
    },
  )

  socket.on('error', err => console.warn('received socket error:', err))

  return {
    disconnect: () => socket.disconnect(),
    connected: () => socket.connected,
    emit: (event, params, cb) => socket.emit(event, params, cb),
    registerHandlers: onChatEvent => {
      socket.on('connect', (...args) => onChatEvent('connect', ...args))
      socket.on('authorization', (...args) => onChatEvent('authorization', ...args))
      socket.on('disconnect', (...args) => onChatEvent('disconnect', ...args))
      socket.on('notification', (...args) => onChatEvent('notification', ...args))
      socket.on('history', (...args) => onChatEvent('history', ...args))
      socket.on('pager', (...args) => onChatEvent('pager', ...args))
      socket.on('read', (...args) => onChatEvent('read', ...args))
      socket.on('message', (...args) => onChatEvent('message', ...args))
      socket.on('rooms', (...args) => onChatEvent('rooms', ...args))
      socket.on('roomExtended', (...args) => onChatEvent('roomExtended', ...args))
      socket.on('lastInteractions', (...args) => onChatEvent('lastInteractions', ...args))
      socket.on('message-error', (...args) => onChatEvent('message-error', ...args))
      socket.on('exception', (...args) => onChatEvent('exception', ...args))
    },
    unregisterHandlers: onChatEvent => {
      socket.off('connect', onChatEvent)
      socket.off('authorization', onChatEvent)
      socket.off('disconnect', onChatEvent)
      socket.off('notification', onChatEvent)
      socket.off('history', onChatEvent)
      socket.off('pager', onChatEvent)
      socket.off('read', onChatEvent)
      socket.off('message', onChatEvent)
      socket.off('rooms', onChatEvent)
      socket.off('roomExtended', onChatEvent)
      socket.off('lastInteractions', onChatEvent)
      socket.off('message-error', onChatEvent)
      socket.off('exception', onChatEvent)
    },
  }
}
