// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey:  "AIzaSyDjUA09ZY95YeemNU1nnlAw34_Ko3mF6EE",
  authDomain: "devconnect-d1e7f.firebaseapp.com",
  projectId: "devconnect-d1e7f",
  storageBucket: "devconnect-d1e7f.firebasestorage.app",
  messagingSenderId: "1031177598815",
  appId: "1:1031177598815:web:d420025354c60a5b75e8ea", 
  measurementId: "G-LGC0HFFG1V"
};
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// دالة طلب التوكن
export const requestForToken = async (updateTokenMutation) => {
  console.log("بداية تشغيل دالة طلب التوكن..."); // فحص 1
  try {
    const permission = await Notification.requestPermission();
    console.log("حالة الصلاحية:", permission); // فحص 2

    if (permission === 'granted') {
      console.log("جاري محاولة جلب التوكن من Firebase...");
      
      const currentToken = await getToken(messaging, { 
        vapidKey: "BGI1F_hVeDCMO4tHOorJ5tuo5k4TyygXZE77nPUkH2KV2rSLnnagL-PkFt8nmR5KSz52GEQMiy8TEuemr0VQSLc" 
      });

      if (currentToken) {
        console.log("COPY_THIS_TOKEN:", currentToken);
        if (updateTokenMutation?.mutate) {
          updateTokenMutation.mutate(currentToken);
        }
      } else {
        console.log("فشل جلب التوكن - تأكدي من الـ Service Worker في مجلد public");
      }
    } else {
      console.log("المستخدم رفض صلاحية الإشعارات");
    }
  } catch (err) {
    console.error("خطأ تقني في Firebase:", err); // سيخبرك هنا إذا كانت المشكلة في الإعدادات
  }
};;

// دالة المستمع (المعدلة لاستقبال رسائل متعددة)
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });