importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDjUA09ZY95YeemNU1nnlAw34_Ko3mF6EE",
  authDomain: "devconnect-d1e7f.firebaseapp.com",
  projectId: "devconnect-d1e7f",
  storageBucket: "devconnect-d1e7f.firebasestorage.app", // الحقل الناقص
  messagingSenderId: "1031177598815",
  appId: "1:1031177598815:web:d420025354c60a5b75e8ea",
  measurementId: "G-LGC0HFFG1V" // الحقل الناقص
});

const messaging = firebase.messaging();

// 3. قاموس ترجمة يدوي للإشعارات (لحل مشكلة اللغة من طرف الفرونت إند فقط)
const translations = {
  ar: {
    'follow': 'بدأ بمتابعتك',
    'post_reaction': 'تفاعل مع منشورك',
    'comment_reaction': 'أعجب بتعليقك',
    'new_comment': 'علق على منشورك',
    'reply_comment': 'رد على تعليقك'
  },
  en: {
    'follow': 'followed you',
    'post_reaction': 'liked your post',
    'comment_reaction': 'liked your comment',
    'new_comment': 'commented on your post',
    'reply_comment': 'replied on your comment'
  }
};

// 4. معالجة الإشعارات الواردة أثناء وجود الموقع في الخلفية (Background)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message: ', payload);

  // السحب المباشر من هيكلية ريتا:
  // ريتا ترسل العنوان والنص جاهزين في كائن الـ notification
  const notificationTitle = payload.notification?.title || "DevConnect";
  const notificationOptions = {
    body: payload.notification?.body || "لديك تنبيه جديد",
    icon: '/logo192.png', 
    badge: '/logo192.png',
    tag: payload.data?.target_type, // نستخدم target_type كـ tag
    requireInteraction: true, 
    data: payload.data // نمرر كائن الـ data بالكامل (يحتوي على target_id و target_type)
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// مستمع الضغط (تأكدي من مطابقة أسماء الحقول كما في الـ JSON المرسل)

// داخل ملف firebase-messaging-sw.js
self.addEventListener('notificationclick', (event) => {
  const targetId = event.notification.data.target_id;
  const targetType = event.notification.data.target_type;
  // 🌟 جلب الـ comment_id القادم من سيرفر الخلفية في الفايربيز
  const commentId = event.notification.data.comment_id; 

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 🌟 بناء الرابط الذكي ليحتوي على الـ comment parameter إن وُجد
      let targetUrl = `/post/${targetId}`;
      if (targetType !== 'follow' && commentId) {
        targetUrl = `/post/${targetId}?comment=${commentId}`;
      } else if (targetType === 'follow') {
        targetUrl = `/profile/${targetId}`;
      }

      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
 