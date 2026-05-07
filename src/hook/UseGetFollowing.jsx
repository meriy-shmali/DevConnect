import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFollowing } from '@/api/FollowersApi';

export const useGetFollowing = (userId) => {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: () => fetchFollowing(userId),
    enabled: !!userId, // لا يتم الجلب إلا إذا توفر الـ ID
  });
};

export const useUnFollowMutation = (userId) => { // أضيفي userId هنا
  const queryClient = useQueryClient();
  return useMutation({
    // خطأ فادح: لا تستخدمي fetchFollowing هنا، استخدمي دالة إلغاء المتابعة من الـ API
    mutationFn: (targetId) => api.delete(`/follow/${targetId}/`), 
    onMutate: async (targetUserId) => {
      // يجب إضافة userId للمفتاح ليطابق الجلب
      await queryClient.cancelQueries({ queryKey: ['following', userId] });
      const previousFollowing = queryClient.getQueryData(['following', userId]);

      queryClient.setQueryData(['following', userId], (oldData) => {
        const dataArray = Array.isArray(oldData) ? oldData : (oldData?.data || []);
        return dataArray.map((user) =>
          user.id === targetUserId ? { ...user, isFollowing: false } : user
        );
      });
      return { previousFollowing };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['following', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};