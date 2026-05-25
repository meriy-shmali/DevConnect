import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getuserprofilereq,  updateProfileInfo,getMyProfileReq } from '@/api/ProfilePageApi';
import { toast } from 'react-hot-toast';
import i18n from 'i18next';

export const useGetProfile = (username) => {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => {
      if (username === 'me' || !username) {
        return getMyProfileReq();
      }
      return  getuserprofilereq(username); 
    },
  });
};

export const useUpdatePersonalInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: updateProfileInfo,
      onSuccess: (updatedData,response) => {
      queryClient.setQueryData(['profile', 'me'], updatedData);
     queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });

     const serverMessage = response?.data?.message || "User info updated successfully";
      
      if (i18n.language === 'ar') {
        toast.success(i18n.t('user_info_updated_success'));
      } else {
        toast.success(serverMessage);
      }
    },
    onError: () => {
      toast.error(i18n.t('user_info_updated_failed'));
    }
  });
};