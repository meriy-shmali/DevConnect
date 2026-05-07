import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePost, deletePost } from '@/api/PostApi'; // تأكد من المسار الصحيح لملف الـ API
import { toast } from 'react-hot-toast'; // اختياري للتنبيهات

export const usePostActions = () => {
  const queryClient = useQueryClient();

  // --- ميوتشن التعديل ---
  const updateMutation = useMutation({
    // نمرر كائن يحتوي على postId والبيانات الجديدة
    mutationFn: ({ postId, data }) => updatePost(postId, data),
    
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      
      toast.success("تم تحديث المنشور بنجاح");
    },
    onError: (error) => {
      console.error("Update Error:", error);
      toast.error("فشل في تعديل المنشور");
    },
  });

  // --- ميوتشن الحذف ---
  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
    onSuccess: () => {
      // تحديث القائمة بعد الحذف لإخفاء المنشور المحذوف
      queryClient.invalidateQueries(['posts']);
      toast.success("تم حذف المنشور");
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء الحذف");
    },
  });

  return {
    updateMutation,
    deleteMutation,
    // اختصار للحالة لسهولة الاستخدام في الـ UI
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading
  };
};