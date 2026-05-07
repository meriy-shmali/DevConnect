import { User } from "lucide-react";
import api from "./Api";

// جلب بروفايل مستخدم آخر (يستخدم المعرف الرقمي id بناءً على تجربة Postman)
export const getuserprofilereq = async (userId) => {
  const { data } = await api.get(`/profile/${userId}/`); 
  return data;
};

// جلب بروفايلك الشخصي (المسار الصحيح هو me)
export const getMyProfileReq = async () => {
  const { data } = await api.get('/profile/me/');
  return data;
};

// تحديث المعلومات الشخصية
export const updateProfilereq = async (formData) => {
  // استخدام PUT والرابط الموضح في البوستمان
  const { data } = await api.put('/profile/me/update/photo/', formData);
  return data;
};
export const deleteProfilePhotoReq = async () => {
  const { data } = await api.delete('/profile/me/update/photo/'); // تأكدي من الرابط من الباك إند
  return data;
};
// دالة تحديث بيانات البروفايل
export const updateProfileInfo = async (profileData) => {
  // ملاحظة: تأكدي من المسار في الباك إند، غالباً ما يكون /profile/update/ أو مشابه
  const { data } = await api.patch('/profile/me/update/info', profileData);
  return data;
};