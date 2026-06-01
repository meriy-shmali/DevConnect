import api from "./Api"; // الاستيراد من ملف Api.js الذي يحتوي على رابط render.com

export const followUser = async (userId) => {
  const { data } = await api.post(`/follow/${userId}/`); 
  return data;
};

export const fetchFollowers = async (userId) => {
  const { data } = await api.get(`/user/${userId}/followers/`); 
  return data;
};

export const fetchFollowing = async (userId) => {
  const { data } = await api.get(`/user/${userId}/following/`);
  return data;
};