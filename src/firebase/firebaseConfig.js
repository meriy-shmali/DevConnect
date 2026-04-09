// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestForToken = async (updateTokenMutation) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const currentToken = await getToken(messaging, {
        // نضع المفتاح الذي أرسلتِه هنا بالضبط
        vapidKey: "BGI1F_hVeDCMO4tHOorJ5tuo5k4TyygXZE77nPUkH2KV2rSLnnagL-PkFt8nmR5KSz52GEQMiy8TEuemr0VQSLc"
      });
      
      if (currentToken) {
        updateTokenMutation(currentToken); // إرسال التوكن للباك إند
        console.log("FCM Token:", currentToken);
      }
    }
  } catch (err) {
    console.log("Error retrieving token: ", err);
  }
};