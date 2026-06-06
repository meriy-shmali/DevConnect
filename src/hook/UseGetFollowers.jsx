import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFollowers, followUser } from '@/Api/FollowersApi';

export const useGetFollowers = (userId) => {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: () => fetchFollowers(userId),
    enabled: !!userId,
  });
};

export const useFollowersMutation = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: followUser,
    onMutate: async (targetUserId) => {

      await queryClient.cancelQueries({ queryKey: ['followers', userId] });
      const previousFollowers = queryClient.getQueryData(['followers', userId]);

      queryClient.setQueryData(['followers', userId], (oldData) => {
        
        const dataArray = Array.isArray(oldData) ? oldData : (oldData?.data || []);
        return dataArray.map((user) =>
          user.id === targetUserId ? { ...user, isFollowing: true } : user
        );
      });
      return { previousFollowers };
    },
    onSettled: () => {
     
      queryClient.invalidateQueries({ queryKey: ['followers', userId] });
      queryClient.invalidateQueries({ queryKey: ['following', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile'] }); 
    },
  });
};