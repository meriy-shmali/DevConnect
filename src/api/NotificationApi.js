import axios from "axios";

// جلب الإشعارات
export const getNotificationsReq = () => axios.get("/notifications/");

// جلب عدد غير المقروء
export const getUnreadCountReq = () => axios.get("/notifications/unread-count/");

// تحديث إشعار لمقروء (عند الضغط فقط)
export const markAsReadReq = (id) => axios.post(`/notifications/${id}/read/`);

// إرسال توكن المتصفح للباك إند
export const updateFcmTokenReq = (token) => axios.post("/api/update-fcm-token/", { token });