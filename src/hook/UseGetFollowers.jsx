import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFollowers, followUser } from '@/Api/FollowersApi';

export const useGetFollowers = (userId) => {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: () => fetchFollowers(userId),
    enabled: !!userId, // لا يتم الجلب إلا إذا توفر الـ ID
  });
};

export const useFollowersMutation = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: followUser,
    onMutate: async (targetUserId) => {
      // التأكد من استخدام نفس المفتاح تماماً كما في useGetFollowers
      await queryClient.cancelQueries({ queryKey: ['followers', userId] });
      const previousFollowers = queryClient.getQueryData(['followers', userId]);

      queryClient.setQueryData(['followers', userId], (oldData) => {
        // تأكدي من هيكلية البيانات هنا (هل هي مصفوفة مباشرة أم داخل .data؟)
        const dataArray = Array.isArray(oldData) ? oldData : (oldData?.data || []);
        return dataArray.map((user) =>
          user.id === targetUserId ? { ...user, isFollowing: true } : user
        );
      });
      return { previousFollowers };
    },
    onSettled: () => {
      // تحديث كل ما يتعلق بالمتابعين والمتابَعين والبروفايل
      queryClient.invalidateQueries({ queryKey: ['followers', userId] });
      queryClient.invalidateQueries({ queryKey: ['following', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile'] }); 
    },
  });
};