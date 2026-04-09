import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

export const changePasswordApi = async (data) => {
  // نرسل الحقول بأسماء تتوافق مع ما يتوقعه الباك اند غالباً
  const response = await api.post('/auth/change-password', {
    current_password: data.password,
    new_password: data.newpassword,
    new_password_confirmation: data.confirmpassword,
  });
  return response.data;
};