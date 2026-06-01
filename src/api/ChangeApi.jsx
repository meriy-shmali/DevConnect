import api from "./Api";
import axios from "axios"; // ← أضيفي هاد

const BASE_URL = "https://devconnect-vbiy.onrender.com";

export const changePasswordApi = async (data) => {
  const response = await api.put('/profile/me/settings/change-password/', {
    old_password: data.password,
    new_password: data.newpassword,
    confirm_new_password: data.confirmpassword,
  });
  return response.data;
};

// ← هون استخدمي axios مباشرة بدون token
export const sendOtpApi = async (email) => {
  const response = await axios.post(`${BASE_URL}/send-otp/`, { email });
  return response.data;
};

// ← وهون كمان
export const resetPasswordApi = async (data) => {
  const response = await axios.post(`${BASE_URL}/verify-otp/`, {
    email: data.email,
    otp: data.otp,
    new_password: data.newpassword,
    confirm_password: data.confirmpassword,
  });
  return response.data;
};