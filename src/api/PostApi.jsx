import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000'; // كما يظهر في صور Postman

export const updatePost = async (postId, data) => {
  // data يمكن أن تحتوي على content أو delete_images
  const response = await axios.patch(`${BASE_URL}/posts/${postId}/edit/`, data);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await axios.delete(`${BASE_URL}/posts/${postId}/edit/`);
  return response.data;
};