import api from "./Api";

/**
 * دالة جلب بيانات الحساب
 * تم تغيير اسمها ليتوافق مع استدعاء useGetAccountData في الميوتيشن
 */
export const getaccountdatareq =async () => {
   const response = await api.get('/profile/me/settings/');
  return response.data;
};

/**
 * دالة تحديث اسم المستخدم
 * تم تغيير اسمها إلى updateusernamereq لتطابق الميوتيشن والبوستمان
 */
export const updateusernamereq = async (data) => {
  const formData = new FormData();
  formData.append('username', data.username);

  const response = await api.put('/profile/me/settings/change-username/', formData);
  return response.data;
};

/**
 * دالة تغيير كلمة المرور
 */
export const updatepasswordreq = async (data) => {
  const response = await api.put('/profile/me/settings/change-password/', data);
   return response.data;
};

/**
 * دالة جلب المنشورات المحفوظة للمستخدم
 * تعتمد على الرابط الظاهر في البوستمان: /posts/saved/
 */
export const getSavedPostsApi = async (page = 1) => {
  const response = await api.get(`/posts/saved/?page=${page}`);
  return response.data;
};