import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getuserprofilereq,  updateProfilereq,getMyProfileReq } from '@/api/ProfilePageApi';

export const useGetProfile = (username) => {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => {
      // إذا كان المستخدم هو "me" أو لم يتم تحديد اسم، اطلبي بروفايلك الشخصي
      if (username === 'me' || !username) {
        return getMyProfileReq();
      }
      // وإلا اطلبي بروفايل مستخدم آخر (تحتاج دالة أخرى تأخذ ID)
      return  getuserprofilereq(username); 
    },
  });
};

export const useUpdatePersonalInfo = (username) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfilereq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
    },
  });
};
