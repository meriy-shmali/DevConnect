import axios from "axios";

// 🌟 تعديل الرابط ليدعم متغيرات البيئة تلقائياً (محلياً وعلى Vercel)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://devconnect-vbiy.onrender.com", 
    timeout: 60000,
});

// 🌟 1. انترسيبتور الطلب (Request Interceptor)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🌟 2. انترسيبتور الاستجابة (Response Interceptor)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // استثناء واجهات تسجيل الدخول والـ OTP من المعالجة التلقائية
    const isPublicRequest = 
      originalRequest?.url?.includes('/send-otp') || 
      originalRequest?.url?.includes('/login') ||
      originalRequest?.url?.includes('/refresh'); // استثناء رابط التجديد أيضاً منعاً للتكرار اللانهائي

    // إذا كانت الاستجابة 401 والطلب ليس عاماً، ولم يتم محاولة تجديد التوكن لهذا الطلب من قبل
    if (error.response?.status === 401 && !isPublicRequest && !originalRequest._retry) {
      originalRequest._retry = true; // نضع علامة بأننا نحاول التجديد الآن

      try {
        const refreshToken = localStorage.getItem("refresh");
        
        if (refreshToken) {
          // 🔄 إرسال طلب للباك إند لتجديد الـ access token
          // تنويه: تأكدي من مسار الـ /auth/refresh/ أو المسار المطابق لديكِ في الباك إند
          const response = await axios.post(`${api.defaults.baseURL}/auth/refresh/`, {
            refresh: refreshToken
          });

          const newAccessToken = response.data.access;

          // حفظ التوكن الجديد في الذاكرة
          localStorage.setItem("access", newAccessToken);

          // تحديث الهيدر للطلب الحالي وإعادة إرساله تلقائياً
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest); 
        }
      } catch (refreshError) {
        // إذا فشل تجديد التوكن (الـ refresh token منتهي الصلاحية أيضاً)
        console.error("Refresh token expired or invalid", refreshError);
      }

      // 🚨 إذا وصلنا هنا، يعني لا يوجد refresh token أو عملية التجديد فشلت -> نطرد المستخدم
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      
      // طريقتكِ الذكية في إعادة التوجيه بدون Reload
      window.history.replaceState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }

    return Promise.reject(error);
  }
);

export default api;