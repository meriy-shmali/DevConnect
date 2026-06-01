import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePost, deletePost } from '@/api/PostApi'; 
import { toast } from 'react-hot-toast';
import i18next from 'i18next';

export const usePostActions = () => {

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: ({ postId, data }) => updatePost(postId, data), 
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      
      toast.success(i18next.t('post_updated_success'));
    },
    onError: (error) => {
      console.error("Update Error:", error);
      toast.error(i18next.t('post_updated_failed'));
    },
  });

  // --- ميوتشن الحذف ---
  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
    onSuccess: () => {
     
      queryClient.invalidateQueries(['posts']);
      toast.success(i18next.t('post_deleted_success'));
    },
    onError: (error) => {
  //    toast.error("حدث خطأ أثناء الحذف");
    },
  });

  return {
    updateMutation,
    deleteMutation,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading
  };
};