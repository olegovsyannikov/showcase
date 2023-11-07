importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js')

firebase.initializeApp({
  apiKey: 'AIzaSyDBAiaclhzIehRbe3UEhfiD5T7RRLT7SsU',
  authDomain: 'privilege-15570.firebaseapp.com',
  databaseURL: 'https://privilege-15570.firebaseio.com',
  projectId: 'privilege-15570',
  storageBucket: 'privilege-15570.appspot.com',
  messagingSenderId: '368269514874',
  appId: '1:368269514874:web:5c68823d50269a58afc3c3',
})

const messaging = firebase.messaging()

// messaging.onBackgroundMessage(payload => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload)
//   const { title, body } = payload.notification

//   return self.registration.showNotification(title, {
//     body: body,
//     icon: '/assets/favicon.png',
//     link: null
//   })
// })
