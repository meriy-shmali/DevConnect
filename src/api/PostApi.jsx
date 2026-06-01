import api from "./Api";

// تعديل منشور (PATCH)
// دالة لتعديل أي حقل (نص، كود، لغة البرمجة)
export const updatePost = async ( postId, data ) => {
  const response = await api.patch(`/posts/${postId}/edit/`, data);
  return response.data;
};

// دالة مخصصة إذا أردتِ حذف صورة معينة من المنشور
export const deletePostImage = async (postId, imageId) => {
    const response = await api.patch(`/posts/${postId}/edit/`, {
        delete_images: imageId
    });
    return response.data;
};

// حذف منشور (DELETE)
export const deletePost = async (postId) => {
    const response = await api.delete(`/posts/${postId}/edit/`);
    return response.data; // سيعيد { "message": "Post deleted successfully" }
};