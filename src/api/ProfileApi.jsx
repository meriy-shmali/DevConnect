import axios from 'axios';

// دالة تحديث البيانات
export const updateProfilereq = async (formData) => {
  const token = localStorage.getItem('token');
  // استخدم patch للتحديث الجزئي و await للحصول على النتيجة
  const response = await axios.patch('/user/update-profile', formData,{headers:{Authorization:`Bearer ${token}`}});
  return response.data;
};

// دالة جلب البيانات
export const getProfilereq = async () => {
  const response = await axios.get('/user/profile');
  return response.data;
};
export const getF = async (username) => {
  const { data } = await axios.get(`/users/profile/${username}`);
  return data;
};