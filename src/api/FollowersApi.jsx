import axios from 'axios';

// استبدل هذا بالـ Base URL الخاص بمشروعك
const API = axios.create({
  baseURL: 'https://api.yourdomain.com', 
});

// جلب قائمة المتابعين بناءً على معرف المستخدم
export const fetchFollowers = async (userId) => {
  const { data } = await API.get(`/users/${userId}/followers`);
  return data; // نفترض أن البيانات تعود كمصفوفة [ {id, username, avatar}, ... ]
};

// ميوتيشن للمتابعة (اختياري إذا أردت استخدامه داخل المودال)
export const followUser = async (targetUserId) => {
  const { data } = await API.post(`/follow`, { targetUserId });
  return data;
};