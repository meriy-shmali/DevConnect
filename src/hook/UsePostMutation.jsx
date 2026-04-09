import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePost, deletePost } from '../api/postApi';

export const usePostMutation = () => {
  const queryClient = useQueryClient();

  // ميو تيشن التعديل
  const editMutation = useMutation({
    mutationFn: ({ postId, content, deleteImages }) => 
      updatePost(postId, { content, delete_images: deleteImages }),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']); // تحديث قائمة المنشورات بعد التعديل
    },
  });

  // ميو تيشن الحذف
  const removeMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });

  return { editMutation, removeMutation };
};