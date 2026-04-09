import axios from 'axios';

// استبدل هذا بالـ Base URL الخاص بمشروعك
const API = axios.create({
  baseURL: 'https://api.yourdomain.com', 
});

// جلب قائمة المتابعين بناءً على معرف المستخدم
export const fetchFollowing = async (userId) => {
  const { data } = await API.get(`/users/${userId}/following`);
  return data; // نفترض أن البيانات تعود كمصفوفة [ {id, username, avatar}, ... ]
};

