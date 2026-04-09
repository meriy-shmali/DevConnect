importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  projectId: "YOUR_PROJECT_ID",
});

const messaging = firebase.messaging();

// عندما يضغط المستخدم على إشعار الويندوز/الموبايل
self.onnotificationclick = function(event) {
  event.notification.close();
  const data = event.notification.data;

  let targetUrl = '/';
  if (data.target_type === 'post') targetUrl = `/post/${data.target_id}`;
  if (data.target_type === 'profile') targetUrl = `/profile/${data.from_username}`;

  event.waitUntil(
    clients.openWindow(targetUrl)
  );
};