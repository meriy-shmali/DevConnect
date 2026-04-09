import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFollowers, followUser } from '@/Api/FollowersApi';

export const useGetFollowers = (userId) => {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: () => fetchFollowers(userId),
    enabled: !!userId, // لا يتم الجلب إلا إذا توفر الـ ID
  });
};

export const useFollowMutation = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: followUser,
    onMutate: async (targetUserId) => {
      // 1. إلغاء أي عمليات جلب بيانات جارية لتجنب التضارب
      await queryClient.cancelQueries({ queryKey: ['following', userId] });

      // 2. حفظ نسخة احتياطية من البيانات الحالية للطوارئ
      const previousFollowing = queryClient.getQueryData(['following', userId]);

      // 3. تحديث الكاش محلياً وفوراً (تحويل الحالة لـ true)
      queryClient.setQueryData(['following', userId], (oldData) => {
        if (!oldData) return [];
        return oldData.map((user) =>
          user.id === targetUserId ? { ...user, isFollowing: true } : user
        );
      });

      return { previousFollowing };
    },

    // 4. في حال فشل الطلب، استعادة البيانات الأصلية
    onError: (err, targetUserId, context) => {
      if (context?.previousFollowing) {
        queryClient.setQueryData(['following', userId], context.previousFollowing);
      }
    },

    // 5. مزامنة البيانات مع السيرفر بعد الانتهاء
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['following', userId] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};