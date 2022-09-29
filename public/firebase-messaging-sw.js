// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyDBjEM2Js2hGmJjB-CdHZi2WLOBhLTgFKA',
  authDomain: 'timesheet-dev-1c743.firebaseapp.com',
  projectId: 'timesheet-dev-1c743',
  storageBucket: 'timesheet-dev-1c743.appspot.com',
  messagingSenderId: '431637898373',
  appId: '1:431637898373:web:989cbaf8ccf42f231875ec',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
 // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});