import axios from "axios";

// الرابط الأساسي بناءً على إعدادات السيرفر لديك
const BASE_URL = "https://devconnect-vbiy.onrender.com/profile/me/settings";

/**
 * دالة جلب بيانات الحساب
 * تم تغيير اسمها ليتوافق مع استدعاء useGetAccountData في الميوتيشن
 */
export const getaccountdatareq = () => {
  const token = localStorage.getItem('token')
    return axios.get(`${BASE_URL}/`, {
        headers: {
            // هذا السطر هو الذي سيجعل الداتا تظهر تلقائياً
            'Authorization': `Bearer ${token} `
         }
    });
};

/**
 * دالة تحديث اسم المستخدم
 * تم تغيير اسمها إلى updateusernamereq لتطابق الميوتيشن والبوستمان
 */
export const updateusernamereq = (data) => {
  const token = localStorage.getItem('token');
  
  // إنشاء FormData لإرسال البيانات بالشكل الذي يتوقعه الباك-أند
  const formData = new FormData();
  formData.append('username', data.username);

  return axios.put(`https://devconnect-vbiy.onrender.com/profile/me/settings/change-username/`, formData, {
    headers: {
      'Authorization':` Bearer ${token}`,
      // عند استخدام FormData، المتصفح سيقوم بتحديد Content-Type تلقائياً مع الـ boundary
    }
  });
};

/**
 * دالة تغيير كلمة المرور
 */
export const updatepasswordreq = (data) => {
  return axios.put(`${BASE_URL}/change-password/`, data);
};


/**
 * دالة إرسال كود التحقق (OTP)
 */
