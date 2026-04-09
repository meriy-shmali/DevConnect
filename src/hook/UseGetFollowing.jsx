import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFollowing } from '@/Api/FollowingApi';

export const useGetFollowing = (userId) => {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: () => fetchFollowing(userId),
    enabled: !!userId, // لا يتم الجلب إلا إذا توفر الـ ID
  });
};

export const useUnFollowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetchFollowing,
    onMutate: async (targetUserId) => {
      // إلغاء أي جلب بيانات جاري لنفس المفتاح لتجنب تضارب البيانات
      await queryClient.cancelQueries({ queryKey: ['following'] });

      // حفظ النسخة الاحتياطية من البيانات الحالية (في حال فشل الطلب)
      const previousFollowing = queryClient.getQueryData(['following']);

      // تحديث الكاش يدوياً وفوراً
      queryClient.setQueryData(['following'], (oldData) => {
        if (!oldData) return [];
        // تحويل isFollowing لـ false للمستخدم الذي ضغطنا عليه
        return oldData.map((user) =>
          user.id === targetUserId ? { ...user, isFollowing: false } : user
        );
      });

      return { previousFollowing };
    },

    // في حال حدوث خطأ، نعيد البيانات القديمة
    onError: (err, targetUserId, context) => {
      if (context?.previousFollowing) {
        queryClient.setQueryData(['following'], context.previousFollowing);
      }
    },

    // في كل الأحوال (نجاح أو فشل) نقوم بعمل Invalidate للتأكد من المزامنة مع السيرفر
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};