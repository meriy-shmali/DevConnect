import api from "./Api";

export const changePasswordApi = async (data) => {
  // التغيير من post إلى put وتعديل أسماء الحقول لتطابق الصورة
  const response = await api.put('/profile/me/settings/change-password/', {
    old_password: data.password,          // الصورة تطلب old_password
    new_password: data.newpassword,       // الصورة تطلب new_password
    confirm_new_password: data.confirmpassword, // الصورة تطلب confirm_new_password
  });
  return response.data;
};
// داخل ملف الـ API الخاص بـ Account
export const sendOtpApi = async (email) => {
  const response = await api.post('/send-otp/', { email : email});
  return response.data;
};

// داخل ملف الـ API الخاص بـ Account
export const resetPasswordApi = async (data) => {
  const response = await api.post('/verify-otp/', {
    email: data.email,
    otp: data.otp,
    new_password: data.newpassword,       // تأكد من مطابقة الاسم للصورة
    confirm_password: data.confirmpassword // تأكد من مطابقة الاسم للصورة
  });
  return response.data;
};