// استيراد النسخة التي أنشأتها في ملف api (افترضت اسمه api.js)
import api from "./api"; 

export const getNotificationsReq = () => api.get("/notifications/");

export const getUnreadCountReq = () => api.get("/notifications/unread-count/");

export const markAsReadReq = (id) => api.post(`/notifications/${id}/read/`);

// ملاحظة: الرابط في الصورة هو /update-fcm-token/ وليس /api/update-fcm-token/
// في ملف api.js أو ملف الطلبات
export const updateFcmTokenReq = (tokenValue) => {
  const formData = new FormData();
  formData.append('token', tokenValue); 
  // نعتمد على الـ interceptor الموجود مسبقاً في api.js
  return api.post("/update-fcm-token/", formData); 
};
export const getPostByIdReq = (id) => api.get(`/posts/${id}/`);