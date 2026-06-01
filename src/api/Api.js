import axios from "axios";

const api = axios.create({
    baseURL: "https://devconnect-vbiy.onrender.com",
    timeout: 60000,
});

// 🌟 1. انترسيبتور الطلب (Request Interceptor): يضيف التوكن تلقائياً لكل طلب يخرج من التطبيق
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      // تأكدي من صيغة الهيدر التي يتوقعها الباك إيند (Bearer أو Token أو بدون سابقة)
      // الصيغة القياسية لـ JWT هي Bearer
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🌟 2. انترسيبتور الاستجابة (Response Interceptor): يتعامل مع الأخطاء القادمة من السيرفر
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // استثناء واجهات تسجيل الدخول وطلب الـ OTP من الطرد التلقائي
    const isPublicRequest = 
      error.config?.url?.includes('/send-otp') || 
      error.config?.url?.includes('/login');

    if (error.response?.status === 401 && !isPublicRequest) {
    localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      // ✅ بدل window.location.href — بس نغير الـ URL بدون reload
      window.history.replaceState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    return Promise.reject(error);
  }
);

export default api;